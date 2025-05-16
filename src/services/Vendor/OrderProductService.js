const mongoose = require("mongoose");
const Order = require("../../models/Order");
const User = require("../../models/User");

const getAllOrderProducts = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkId = await User.findById(userId);
      if (!checkId) {
        return resolve({
          status: "ERR",
          message: "User not found",
        });
      }

      const allOrderProducts = await Order.find({
        "items.owner_id": new mongoose.Types.ObjectId(userId),
      }).populate("user_id", "user_name"); // 👉 Chỉ lấy user_name của người mua

      // allOrderProducts.forEach((order) => {
      //   console.log("Tên người mua:", order.user_id?.user_name);
      // });

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: allOrderProducts,
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
  getAllOrderProducts,
  changeStatusOrder,
};
