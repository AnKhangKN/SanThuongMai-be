const User = require("../../models/User");

const partialUpdateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });

      if (!checkUser) {
        return reject({
          status: "ERROR",
          message: "Không tìm thấy người dùng",
        });
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: id },
        { $set: data },
        { new: true }
      );

      resolve({
        status: "OK",
        message: "Cập nhật thành công",
        data: updatedUser,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  partialUpdateUser,
};
