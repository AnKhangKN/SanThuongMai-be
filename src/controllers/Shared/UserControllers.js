const UserServices = require("../../services/Shared/UserServices");
const jwtService = require("../../utils/jwt");

const refreshToken = async (req, res) => {
  try {
    const token = req.headers.token.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Người dùng chưa đăng nhập",
      });
    }

    const result = await jwtService.refreshTokenService(token);

    return res.status(200).json(result);
  } catch (error) {
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

    const result = await UserServices.loginUser(req.body);

    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Internal Server Error",
    });
  }
};

module.exports = { loginUser, refreshToken };
