const User = require("../../models/User");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { user_name, email, password, phone } = newUser;

    try {
      // Kiểm tra email đã tồn tại chưa
      const checkUser = await User.findOne({ email });
      if (checkUser) {
        return reject({
          status: "ERROR",
          message: "Email đã được sử dụng!",
        });
      }

      // Mã hóa mật khẩu trước khi tạo tài khoản
      const hash = bcrypt.hashSync(password, 10);

      const createdUser = await User.create({
        user_name,
        email,
        password: hash,
        phone,
      });

      // Nếu tạo thành công
      if (createdUser) {
        return resolve({
          status: "OK",
          message: "Tạo tài khoản thành công",
          data: createdUser,
        });
      }

      // Nếu tạo không thành công (trường hợp hiếm gặp)
      return reject({
        status: "ERROR",
        message: "Không thể tạo tài khoản",
      });
    } catch (e) {
      return reject({
        status: "ERROR",
        message: e.message || "Lỗi server",
      });
    }
  });
};

const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });

      if (!checkUser) {
        return resolve({
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

const getDetailUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const detailUser = await User.findOne({ _id: userId });

      if (!detailUser) {
        return reject({
          status: "ERROR",
          message: "Không tìm thấy người dùng",
        });
      }

      console.log(detailUser);

      resolve({
        status: "OK",
        message: "Lấy thông tin thành công",
        data: detailUser,
      });
    } catch (error) {
      reject({
        status: "ERROR",
        message: error.message || "Lỗi khi truy vấn dữ liệu người dùng",
      });
    }
  });
};

module.exports = {
  createUser,
  updateUser,
  partialUpdateUser,
  getDetailUser,
};
