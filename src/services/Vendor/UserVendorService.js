const User = require("../../models/User");

const createVendor = (userId, newVendor) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: userId,
      });

      if (checkUser === null) {
        resolve({
          status: "OK",
          message: "The user is not exist",
        });
      }

      const isvendor = (newVendor.isVendor = true);
      const status = (newVendor.shop.status = "pending");

      const updatedUser = await User.findByIdAndUpdate(userId, newVendor, {
        new: true,
      });

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createVendor,
};
