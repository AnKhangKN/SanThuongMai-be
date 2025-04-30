const AuthServices = require("../../services/Shared/AuthServices");
const jwtService = require("../../utils/jwt");

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refresh_token;

    if (!token) {
      return res.status(401).json({
        status: "ERROR",
        message: "Người dùng chưa đăng nhập",
      });
    }

    const result = await jwtService.refreshTokenService(token);

    return res.status(200).json(result);
  } catch (error) { // Sửa từ 'e' thành 'error'
    return res.status(500).json({
      message: error.message || "Internal Server Error", // Sửa 'e' thành 'error'
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email hoặc mật khẩu không được để trống",
      });
    }

    const reg = /^[\w\.-]+@[\w\.-]+\.\w{2,}$/;
    if (!reg.test(email)) {
      return res.status(400).json({
        status: "error",
        message: "Email không đúng định dạng",
      });
    }

    const result = await AuthServices.loginUser({ email, password });

    // Nếu không muốn gửi refresh_token
    const { refresh_token, ...newResult } = result;

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false, // nếu đang ở localhost thì nên false
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 365,
      path: "/",
    });

    return res.status(200).json(newResult);
  } catch (e) {
    return res.status(500).json({
      status: "error",
      message: e.message || "Đã xảy ra lỗi hệ thống",
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { email, password, confirm_password } = req.body;

    // Kiểm tra field có trống hay không
    if (!email || !password || !confirm_password) {
      return res.status(400).json({
        status: "ERROR",
        message: "Có thuộc tính trống",
      });
    }

    const reg = /^[\w\.-]+@[\w\.-]+\.\w{2,}$/;
    const isCheckEmail = reg.test(email);

    // kiểm tra có đúng là email không
    if (!isCheckEmail) {
      return res.status(400).json({
        status: "ERROR",
        message: "Email không đúng định dạng",
      });
    }

    // Kiểm tra nhập lại mật khẩu
    if (password !== confirm_password) {
      return res.status(400).json({
        status: "ERROR",
        message: "Mật khẩu không khớp",
      });
    }

    const result = await AuthServices.createUser(req.body);
    console.log(result);

    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Internal Server ERROR",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refresh_token");

    return res.status(200).json({
      status: "OK",
      message: "Đăng xuất thành công",
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Internal Server Error",
    });
  }
};

module.exports = {
  loginUser,
  refreshToken,
  createUser,
  logoutUser,
};
