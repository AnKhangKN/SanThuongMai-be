const User = require("../../models/User");

const deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: userId });

      if (!checkUser) {
        resolve({
          status: "ERROR",
          message: "Không tìm thấy người dùng",
        });
      }

      await User.findOneAndDelete({ _id: userId }); // delete user

      resolve({
        status: "OK",
        message: "Xóa thành công",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const bannedUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });

      if (!checkUser) {
        return resolve({
          status: "ERROR",
          message: "Không tìm thấy người dùng",
        });
      }

      const bannedUser = await User.findOneAndUpdate(
        { _id: id },
        { account_status: "banned" },
        { new: true }
      );

      resolve({
        status: "OK",
        message: "Người dùng đã bị chặn",
        data: bannedUser,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUser = await User.find();

      resolve({
        status: "OK",
        message: "Lấy danh sách thành công",
        data: allUser,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  deleteUser,
  bannedUser,
  getAllUser,
};
