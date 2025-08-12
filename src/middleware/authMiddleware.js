const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// Hàm tách token từ header
const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.split(" ")[1].replace(/"/g, "");
};

// Middleware xác thực token
const verifyToken = (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ message: "Token bị thiếu", status: "ERROR" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Token không hợp lệ", status: "ERROR" });
    }

    req.user = decoded;
    next();
  });
};

// Admin Middleware
const isAdmin = (req, res, next) => {
  if (req.user?.isAdmin === true) return next();
  return res.status(403).json({
    status: "ERROR",
    message: "Người dùng không phải là Admin!",
  });
};

// Seller Middleware
const isVendor = (req, res, next) => {
  if (req.user?.isVendor === true) return next();
  return res.status(403).json({
    status: "ERROR",
    message: "Người dùng không phải là chủ Shop!",
  });
};

// User thông thường (không phải Admin và không phải Seller)
const isUser = (req, res, next) => {
  if (!req.user?.isAdmin && !req.user?.isSeller) return next();
  return res.status(403).json({
    status: "ERROR",
    message: "Không phải người dùng thông thường!",
  });
};

// Lưu thông tin để train AI
const verifyAi = (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    req.user = null; // Người dùng chưa đăng nhập
    return next();
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      req.user = null; // Token lỗi thì coi như chưa đăng nhập
      return next();
    }

    req.user = decoded;
    next();
  });
};

module.exports = {
  verifyToken,
  isAdmin,
  isVendor,
  isUser,
  verifyAi,
};
