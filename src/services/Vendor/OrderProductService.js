const mongoose = require("mongoose");
const Order = require("../../models/Order");
const User = require("../../models/User");
const Product = require("../../models/Product");

const getOrderByVendor = (vendorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const orders = await Order.find({ "productItems.shopId": vendorId }).sort(
        { createdAt: -1 }
      );

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: orders,
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

module.exports = {
  getOrderByVendor,
  changeStatusOrder,
};
