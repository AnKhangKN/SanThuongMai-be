const mongoose = require("mongoose");
const Order = require("../../models/Order");
const Product = require("../../models/Product");
const User = require("../../models/User");
const Shop = require("../../models/Shop");

const getStatistics = async (vendorId) => {
  // Lấy shop của vendor
  const shop = await Shop.findOne({ ownerId: vendorId }).select("_id shopName");
  if (!shop) {
    throw new Error("Vendor chưa có shop");
  }

  // Lấy thông tin ví của vendor
  const vendor = await User.findById(vendorId).select("wallet");
  if (!vendor) {
    throw new Error("Vendor không tồn tại");
  }

  // Tổng doanh thu
  const totalRevenue = vendor.wallet || 0;

  // Doanh thu tháng này
  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );

  const monthlyOrders = await Order.aggregate([
    { $unwind: "$productItems" },
    {
      $match: {
        "productItems.shopId": shop._id, // dùng shop._id thay vì vendorId
        "productItems.status": "delivered",
        createdAt: { $gte: startOfMonth },
      },
    },
    {
      $group: {
        _id: null,
        revenue: {
          $sum: {
            $multiply: ["$productItems.finalPrice", "$productItems.quantity"],
          },
        },
      },
    },
  ]);

  const monthlyRevenue = monthlyOrders[0]?.revenue || 0;

  // Đếm đơn hàng theo trạng thái
  const ordersCount = await Order.aggregate([
    { $unwind: "$productItems" },
    { $match: { "productItems.shopId": shop._id } },
    { $group: { _id: "$productItems.status", count: { $sum: 1 } } },
  ]);

  const statusCount = ordersCount.reduce((acc, cur) => {
    acc[cur._id] = cur.count;
    return acc;
  }, {});

  // Top sản phẩm bán chạy
  const topProducts = await Order.aggregate([
    { $unwind: "$productItems" },
    {
      $match: {
        "productItems.shopId": shop._id,
        "productItems.status": "delivered",
      },
    },
    {
      $group: {
        _id: "$productItems.productId",
        productName: { $first: "$productItems.productName" },
        quantity: { $sum: "$productItems.quantity" },
        revenue: {
          $sum: {
            $multiply: ["$productItems.finalPrice", "$productItems.quantity"],
          },
        },
      },
    },
    { $sort: { quantity: -1 } },
    { $limit: 5 },
  ]);

  return {
    shopName: shop.shopName,
    totalRevenue,
    monthlyRevenue,
    orders: {
      pending: statusCount.pending || 0,
      processing: statusCount.processing || 0,
      shipping: statusCount.shipping || 0,
      delivered: statusCount.delivered || 0,
      returned: statusCount.returned || 0,
      cancelled: statusCount.cancelled || 0,
    },
    topProducts,
  };
};

module.exports = {
  getStatistics,
};
