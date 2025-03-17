const User = require("../../models/Users");

const createUser = async (newUser) => {
  try {
    const { name, email, password, confirmPassword, phone } = newUser;

    // Kiểm tra mật khẩu có trùng khớp không
    if (password !== confirmPassword) {
      return {
        status: "ERR",
        message: "Mật khẩu không khớp",
      };
    }

    // Tạo người dùng mới trong DB
    const createdUser = await User.create({
      name,
      email,
      password,
      phone,
    });

    return {
      status: "OK",
      message: "User created successfully",
      data: createdUser,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message || "Lỗi server",
    };
  }
};

module.exports = { createUser };
