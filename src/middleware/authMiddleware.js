const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const isAdminMiddleware = (req, res, next) => {
  const token = req.headers.token.split(" ")[1];

  const userId = req.params.id;

  // kiểm tra người dùng có đăng nhập chưa
  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Người dùng chưa đăng nhập",
    });
  }

  // kiểm tra token có hợp lệ không
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).json({
        status: "error",
        message: "Token không hợp lệ",
      });
    }

    // tác object
    const { payload } = user;

    // kiểm tra người dùng có phải admin không
    if (payload?.isAdmin === true || payload?.id === userId) {
      next();
    } else {
      return res.status(403).json({
        status: "error",
        message: "Người dùng chưa có quyền xóa",
      });
    }
  });
};

const isVendorMiddleware = (req, res, next) => {};

const isUserMiddleware = (req, res, next) => {};

module.exports = { isAdminMiddleware };
