const User = require("../../models/User");
const Shop = require("../../models/Shop");

const createVendor = (userId, newVendor) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findById(userId);
      if (!checkUser) {
        return resolve({
          status: "ERR",
          message: "The user does not exist",
        });
      }

      // ✅ Cập nhật User → chỉ thêm isVendor
      checkUser.isVendor = true;
      await checkUser.save();

      // ✅ Tạo mới Shop → với trạng thái pending
      const shopData = {
        ...newVendor.shop,
        state: "pending", // hoặc status: "pending"
      };

      const newShop = await Shop.create(shopData);

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: {
          user: checkUser,
          shop: newShop,
        },
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createVendor,
};
