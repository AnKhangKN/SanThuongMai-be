const mongoose = require("mongoose");
const Order = require("../../models/Order");
const Product = require("../../models/Product");
const Shop = require("../../models/Shop");

const checkShopOwner = async (shopId, userId) => {
  const shop = await Shop.findOne({ _id: shopId, ownerId: userId }).lean();
  return !!shop;
};

const getSummary = async (shopId, opts = { days: 30 }) => {
  const shopObjectId = new mongoose.Types.ObjectId(shopId);
  const days = opts.days || 30;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  const pipeline = [
    { $match: { createdAt: { $gte: start } } },
    { $unwind: "$productItems" },
    { $match: { "productItems.shopId": shopObjectId } },
    { $match: { "productItems.status": { $ne: "cancelled" } } },
    {
      $group: {
        _id: null,
        revenue: {
          $sum: {
            $multiply: ["$productItems.finalPrice", "$productItems.quantity"],
          },
        },
        totalQuantity: { $sum: "$productItems.quantity" },
        orderSet: { $addToSet: "$_id" },
        productsSet: { $addToSet: "$productItems.productId" },
      },
    },
    {
      $project: {
        _id: 0,
        revenue: 1,
        totalQuantity: 1,
        ordersCount: { $size: "$orderSet" },
        productsSoldCount: { $size: "$productsSet" },
      },
    },
  ];

  const [res] = await Order.aggregate(pipeline).exec();
  return (
    res || {
      revenue: 0,
      totalQuantity: 0,
      ordersCount: 0,
      productsSoldCount: 0,
    }
  );
};

const getRevenueTrend = async (shopId, days = 30) => {
  const shopObjectId = new mongoose.Types.ObjectId(shopId);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  const pipeline = [
    { $match: { createdAt: { $gte: start } } },
    { $unwind: "$productItems" },
    { $match: { "productItems.shopId": shopObjectId } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: {
          $sum: {
            $multiply: ["$productItems.finalPrice", "$productItems.quantity"],
          },
        },
        orders: { $addToSet: "$_id" },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        date: "$_id",
        revenue: 1,
        ordersCount: { $size: "$orders" },
        _id: 0,
      },
    },
  ];

  const rows = await Order.aggregate(pipeline).exec();
  return rows;
};

const getOrdersByStatus = async (shopId) => {
  const shopObjectId = new mongoose.Types.ObjectId(shopId);
  const pipeline = [
    { $unwind: "$productItems" },
    { $match: { "productItems.shopId": shopObjectId } },
    {
      $group: {
        _id: "$productItems.status",
        count: { $sum: 1 },
      },
    },
    { $project: { status: "$_id", count: 1, _id: 0 } },
  ];
  const rows = await Order.aggregate(pipeline).exec();
  const map = {};
  rows.forEach((r) => (map[r.status] = r.count));
  return map;
};

const getTopProducts = async (shopId, limit = 5) => {
  const shopObjectId = new mongoose.Types.ObjectId(shopId);
  const pipeline = [
    { $unwind: "$productItems" },
    { $match: { "productItems.shopId": shopObjectId } },
    {
      $group: {
        _id: "$productItems.productId",
        qty: { $sum: "$productItems.quantity" },
        revenue: {
          $sum: {
            $multiply: ["$productItems.finalPrice", "$productItems.quantity"],
          },
        },
      },
    },
    { $sort: { qty: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        productId: "$_id",
        qty: 1,
        revenue: 1,
        productName: "$product.productName",
        images: "$product.images",
      },
    },
  ];

  const rows = await Order.aggregate(pipeline).exec();
  return rows;
};

const getLowStockProducts = async (shopId, threshold = 5) => {
  const products = await Product.aggregate([
    { $match: { shopId: mongoose.Types.ObjectId(shopId) } },
    {
      $project: {
        productName: 1,
        images: 1,
        priceOptions: {
          $filter: {
            input: "$priceOptions",
            as: "po",
            cond: { $lte: ["$$po.stock", threshold] },
          },
        },
      },
    },
    { $match: { "priceOptions.0": { $exists: true } } },
    { $limit: 200 },
  ]);
  return products;
};

const getWarningsAndReports = async (shopId) => {
  const shop = await Shop.findById(shopId).lean();
  if (!shop) return { adminWarnings: [], reports: [] };
  return {
    adminWarnings: shop.adminWarnings || [],
    reports: shop.reports || [],
    followers: shop.followers || 0,
    soldCount: shop.soldCount || 0,
  };
};

module.exports = {
  checkShopOwner,
  getSummary,
  getRevenueTrend,
  getOrdersByStatus,
  getTopProducts,
  getLowStockProducts,
  getWarningsAndReports,
};
