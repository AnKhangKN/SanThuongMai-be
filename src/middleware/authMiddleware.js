const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const isAdminMiddleware = (req, res, next) => {
  // Lấy bearer <token>
  const bearerToken = req.headers.token;

  // Kiểm tra người dùng có đăng nhập chưa
  if (!bearerToken) {
    return res.status(401).json({
      status: "error",
      message: "Bearer token không hợp lệ",
    });
  }

  // Sửa biến đúng tên: breakToken -> beareToken
  const token = bearerToken.split(" ")[1];

  // Gán id vào userId
  const userId = req.params.id;

  // Kiểm tra token có hợp lệ không
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).json({
        status: "error",
        message: "Token không hợp lệ",
      });
    }

    // Tác object
    const { payload } = user;

    // Kiểm tra người dùng có phải admin không hoặc đúng id của Admin
    if (payload?.isAdmin === true || payload?.id === userId) {
      next();
    } else {
      return res.status(403).json({
        status: "error",
        message: "Người dùng không phải admin",
      });
    }
  });
};

const isVendorMiddleware = (req, res, next) => {
  const bearerToken = req.headers.token;

  // Kiểm tra token có tồn tại không
  if (!bearerToken) {
    return res.status(401).json({
      status: "error",
      message: "Bearer token không hợp lệ",
    });
  }

  // Lấy phần token sau "Bearer "
  const token = bearerToken.split(" ")[1];
  const userId = req.params.id;

  // Xác thực token
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).json({
        status: "error",
        message: "Token không hợp lệ",
      });
    }

    const payload = user;

    // Kiểm tra user có phải là vendor hoặc đúng id không
    if (payload?.isVendor === true || payload?.id === userId) {
      next();
    } else {
      return res.status(403).json({
        status: "error",
        message: "Người dùng không phải vendor",
      });
    }
  });
};

const isUserMiddleware = (req, res, next) => {
  const bearerToken = req.headers.token;

  // Kiểm tra xem có token không
  if (!bearerToken) {
    return res.status(401).json({
      status: "error",
      message: "Bearer token không hợp lệ",
    });
  }

  // Lấy token từ chuỗi "Bearer <token>"
  const token = bearerToken.split(" ")[1];
  const userId = req.params.id;

  // Kiểm tra xem có truyền id hay không
  if (!userId) {
    return res.status(400).json({
      status: "error",
      message: "Không tìm thấy người dùng",
    });
  }

  // Xác thực token
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).json({
        status: "error",
        message: "Token không hợp lệ",
      });
    }

    const payload = user;

    // Kiểm tra: là user thường (isAdmin === false) hoặc đúng ID của user
    if (payload?.isAdmin === false || payload?.id === userId) {
      next();
    } else {
      return res.status(403).json({
        status: "error",
        message: "Không phải người dùng",
      });
    }
  });
};

module.exports = { isAdminMiddleware, isVendorMiddleware, isUserMiddleware };
