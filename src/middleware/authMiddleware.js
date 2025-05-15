const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.split(" ")[1].replace(/"/g, "");
};

// Admin Middleware
const isAdminMiddleware = (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided", status: "ERROR" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err || !decoded?.isAdmin) {
      return res
        .status(403)
        .json({ message: "Người dùng không phải admin", status: "ERROR" });
    }
    req.user = decoded;
    next();
  });
};

// Vendor Middleware
const isVendorMiddleware = (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided", status: "ERROR" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err || !decoded?.isVendor) {
      return res
        .status(403)
        .json({ message: "Người dùng không phải vendor", status: "ERROR" });
    }
    req.user = decoded;
    next();
  });
};

// User Middleware
const isUserMiddleware = (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ message: "Token bị thiếu", status: "ERROR" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      console.log("JWT Error:", err);
      return res
        .status(403)
        .json({ message: "Không phải người dùng", status: "ERROR" });
    }

    req.user = decoded;
    next();
  });
};

module.exports = { isAdminMiddleware, isVendorMiddleware, isUserMiddleware };
