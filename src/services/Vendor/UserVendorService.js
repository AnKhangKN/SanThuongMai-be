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

const getVendorByUserId = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let shop = await Shop.findOne({ ownerId: userId });
      if (!shop) {
        return resolve({
          status: "ERR",
          message: "Shop not found",
        });
      }

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: shop,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateVendorByUserId = (userId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const shop = await Shop.findOneAndUpdate(
        { ownerId: userId },
        { $set: data },
        { new: true }
      );

      if (!shop) {
        resolve({
          status: "ERR",
          message: "Shop not found",
        });
      } else {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: shop,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateAvatar = (userId, avatar) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updated = await Shop.findOneAndUpdate(
        { ownerId: userId },
        { shopAvatar: avatar },
        { new: true }
      );

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updated,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createVendor,
  getVendorByUserId,
  updateVendorByUserId,
  updateAvatar,
};
