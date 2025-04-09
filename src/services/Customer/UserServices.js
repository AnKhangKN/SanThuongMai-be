const User = require("../../models/User");
const bcrypt = require("bcrypt"); // mã hóa mật khẩu

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { user_name, email, password, confirm_password, phone } = newUser;

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
      reject(e); // đúng chuẩn Promise
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

    resolve({
      status: "OK",
      message: "Đăng nhập thành công",
      data: checkUser,
    });
  });
};

module.exports = { createUser, loginUser };
