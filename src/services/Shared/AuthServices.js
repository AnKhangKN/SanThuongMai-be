const User = require("../../models/User");
const bcrypt = require("bcrypt"); // mã hóa mật khẩu
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/jwt");

const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;

    try {
      // Tìm user theo email
      const checkUser = await User.findOne({ email: email });

      // Kiểm tra email có tồn tại không
      if (!checkUser) {
        return resolve({
          status: "ERROR",
          message: "Email không tồn tại",
        });
      }

      // Kiểm tra trạng thái tài khoản
      const accountStatus = checkUser.account_status;

      if (accountStatus === "banned") {
        return reject({
          status: "ERROR",
          message: "Tài khoản của bạn đã bị khóa!",
        });
      }

      if (accountStatus === "inactive") {
        return reject({
          status: "ERROR",
          message: "Tài khoản của bạn bị vô hiệu hóa!",
        });
      }

      // Kiểm tra mật khẩu
      const compare_password = bcrypt.compareSync(password, checkUser.password);

      if (!compare_password) {
        return resolve({
          status: "ERROR",
          message: "Mật khẩu không đúng",
        });
      }

      // Tạo access token
      const access_token = await generateAccessToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
        isVendor: checkUser.isVendor,
      });

      // Tạo refresh token
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
    } catch (error) {
      reject({
        status: "ERROR",
        message: "Có lỗi xảy ra khi đăng nhập",
        error: error.message,
      });
    }
  });
};

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

module.exports = {
  loginUser,
  createUser,
};
