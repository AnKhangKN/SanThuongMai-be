const UserService = require("../../services/Customer/UserServices");
const jwtService = require("../../utils/jwt");

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

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;

    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "Không có người dùng",
      });
    }

    // truyền vào
    const result = await UserService.updateUser(userId, data);

    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Internal Server Error",
    });
  }
};

const partialUpdateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;

    if (!userId || Object.keys(data).length === 0) {
      return res.status(400).json({
        message: "Thiếu thông tin cập nhật",
      });
    }

    const partialUpdate = await UserService.partialUpdateUser(userId, data);

    return res.status(200).json(partialUpdate);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getDetailUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        status: "err",
        message: "Không tìm thấy  người dùng",
      });
    }

    const result = await UserService.getDetailUser(userId);

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

    const result = await UserService.loginUser(req.body);

    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Internal Server Error",
    });
  }
};

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
module.exports = {
  createUser,
  loginUser,
  updateUser,
  partialUpdateUser,
  getDetailUser,
  refreshToken,
};
