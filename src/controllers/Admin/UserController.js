const createUser = (req, res) => {
  try {
    console.log(res.body);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createUser,
};

const UserService = require("../../services/Admin/UserService");

const createUser = async (req, res) => {
  try {
    // Lấy thông tin từ request body
    const { name, email, password, confirmPassword, phone } = req.body;

    // Kiểm tra nếu có trường nào bị thiếu
    if (!name || !email || !password || !confirmPassword || !phone) {
      return res.status(400).json({
        status: "ERR",
        message: "Vui lòng nhập đủ thông tin",
      });
    }

    // Kiểm tra định dạng email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "ERR",
        message: "Email không hợp lệ",
      });
    }

    // Kiểm tra mật khẩu có trùng khớp không
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "ERR",
        message: "Mật khẩu không khớp",
      });
    }

    // Gọi UserService để tạo người dùng
    const user = await UserService.createUser(req.body);

    return res.status(201).json({
      status: "OK",
      message: "Tạo tài khoản thành công",
      data: user,
    });
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Lỗi server",
    });
  }
};

module.exports = { createUser };
