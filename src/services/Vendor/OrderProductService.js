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

      // Tìm các đơn hàng mà trong mảng items có ít nhất 1 sản phẩm của user này
      const allOrderProducts = await Order.find({
        "items.owner_id": userId,
      });

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

module.exports = {
  getAllOrderProducts,
};
