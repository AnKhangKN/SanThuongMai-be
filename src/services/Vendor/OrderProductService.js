const mongoose = require("mongoose");
const Order = require("../../models/Order");
const User = require("../../models/User");
const Product = require("../../models/Product");

const getOrderByVendor = (vendorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const orders = await Order.find({
        "productItems.shopId": vendorId,
      })
        .sort({ createdAt: -1 })
        .lean(); // dùng lean để trả về plain object, dễ xử lý hơn

      // Lọc lại productItems cho đúng shop
      const filteredOrders = orders.map((order) => ({
        ...order,
        productItems: order.productItems.filter(
          (item) => item.shopId.toString() === vendorId.toString()
        ),
      }));

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: filteredOrders,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const changeStatusOrder = (userId, itemId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(userId) ||
        !mongoose.Types.ObjectId.isValid(itemId)
      ) {
        return resolve({
          status: "ERR",
          message: "Invalid userId or itemId",
        });
      }

      const checkId = await User.findById(userId);
      if (!checkId) {
        return resolve({
          status: "ERR",
          message: "User not found",
        });
      }

      // Cập nhật trạng thái cho đúng item có _id = itemId và owner_id = userId
      const result = await Order.updateOne(
        {
          "items._id": new mongoose.Types.ObjectId(itemId),
          "items.owner_id": new mongoose.Types.ObjectId(userId),
        },
        {
          $set: {
            "items.$.status": "processing",
          },
        }
      );

      if (result.matchedCount === 0) {
        return resolve({
          status: "ERR",
          message: "Item not found or does not belong to this user",
        });
      }

      resolve({
        status: "OK",
        message: "Successfully updated item status to 'processing'",
        data: result,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getBuyersInfoService = async () => {
  // Lấy tất cả userId từ đơn hàng
  const orders = await Order.find().select("userId").lean();

  // Loại bỏ trùng lặp userId
  const uniqueUserIds = [...new Set(orders.map((o) => o.userId.toString()))];

  // Truy vấn thông tin người dùng
  const buyers = await User.find({ _id: { $in: uniqueUserIds } })
    .select("fullName email avatar shippingAddress")
    .lean();

  return buyers;
};

const updateOrderProductItemsStatus = async (orderId, shopId, newStatus) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Đơn hàng không tồn tại");
    }

    order.productItems = order.productItems.map((item) => {
      if (
        item.shopId?.toString() === shopId.toString() &&
        ((["pending", "processing"].includes(item.status) &&
          newStatus === "shipping") ||
          (item.status === "shipping" && newStatus === "delivered") ||
          (["pending", "processing", "shipping"].includes(item.status) &&
            newStatus === "cancelled"))
      ) {
        return { ...item, status: newStatus };
      }
      return item;
    });

    await order.save();

    return {
      status: "OK",
      message: "Cập nhật trạng thái sản phẩm thành công",
      data: order,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getOrderByVendor,
  changeStatusOrder,
  getBuyersInfoService,
  updateOrderProductItemsStatus,
};
