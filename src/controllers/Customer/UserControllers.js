const UserService = require("../../services/Customer/UserServices");

const createUser = async (req, res) => {
  try {
    console.log(req.body);

    const { user_name, email, password, confirm_password } = req.body;

    // Kiểm tra field có trống hay không
    if (!user_name || !email || !password || !confirm_password) {
      return res.status(400).json({
        status: "error",
        message: "Có thuộc tính trống",
      });
    }

    const reg = /^[\w\.-]+@[\w\.-]+\.\w{2,}$/;
    const isCheckEmail = reg.test(email);

    // kiểm tra có đúng là email không
    if (!isCheckEmail) {
      return res.status(400).json({
        status: "error",
        message: "Email không đúng định dạng",
      });
    }

    // Kiểm tra nhập lại mật khẩu
    if (password !== confirm_password) {
      return res.status(400).json({
        status: "error",
        message: "Mật khẩu không khớp",
      });
    }

    const result = await UserService.createUser(req.body);

    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Internal Server Error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Có thuộc tính trống",
      });
    }

    const reg = /^[\w\.-]+@[\w\.-]+\.\w{2,}$/;
    const isCheckEmail = reg.test(email);

    // kiểm tra có đúng là email không
    if (!isCheckEmail) {
      return res.status(400).json({
        status: "error",
        message: "Email không đúng định dạng",
      });
    }

    const result = await UserService.loginUser(req.body);

    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Internal Server Error",
    });
  }
};

module.exports = { createUser, loginUser };
