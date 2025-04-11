const User = require("../../models/User");
const bcrypt = require("bcrypt"); // mã hóa mật khẩu
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/jwt");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { user_name, email, password, phone } = newUser;

    try {
      // Kiểm tra email đã tồn tại chưa
      const checkUser = await User.findOne({ email });
      if (checkUser) {
        return resolve({
          status: "ERROR",
          message: "Email đã được sử dụng!",
        });
      }

      // mã hóa mật khẩu trước khi tạo tài khoản
      const hash = bcrypt.hashSync(password, 10);

      const createdUser = await User.create({
        user_name,
        email,
        password: hash,
        phone,
      });

      if (createdUser) {
        resolve({
          status: "OK",
          message: "Tạo tài khoản thành công",
          data: createdUser,
        });
      }
    } catch (e) {
      reject(e);
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

const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;

    const checkUser = await User.findOne({ email: email });

    // kiểm tra email tồn tại
    if (!checkUser) {
      return resolve({
        status: "ERROR",
        message: "Email không tồn tại",
      });
    }

    // kiểm tra mật khẩu
    const compare_password = bcrypt.compareSync(password, checkUser.password);

    if (!compare_password) {
      return resolve({
        status: "ERROR",
        message: "Mật khẩu không đúng",
      });
    }

    // access token (check role)
    const access_token = await generateAccessToken({
      id: checkUser.id,
      isAdmin: checkUser.isAdmin,
      isVendor: checkUser.isVendor,
    });

    // refresh token
    const refresh_token = await generateRefreshToken({
      id: checkUser.id,
      isAdmin: checkUser.isAdmin,
      isVendor: checkUser.isVendor,
    });

    resolve({
      status: "OK",
      message: "Đăng nhập thành công",
      access_token,
      refresh_token,
    });
  });
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  partialUpdateUser,
  getDetailUser,
};
