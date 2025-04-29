const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// Kiểm tra là admin
const isAdminMiddleware = (req, res, next) => {
  const authToken = req.headers.authorization;

  console.log('authToken', authToken);  // In authToken để kiểm tra header

  // Kiểm tra xem có authorization header không
  if (!authToken) {
    return res.status(401).json({
      message: "No token provided",
      status: "ERROR"
    });
  }

  // Lấy token từ Authorization header (Bearer <token>)
  const token = authToken.split(" ")[1].replace(/"/g, "");
  console.log('Token:', token);  // In token ra console để kiểm tra

  // Giải mã token và kiểm tra xem nó có hợp lệ không
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: "Token không hợp lệ",
        status: "ERROR"
      });
    }

    // Giả sử payload của token có trường 'isAdmin' để kiểm tra quyền admin
    if (decoded.isAdmin === true) {
      req.user = decoded;  // Gán decoded vào request để các middleware sau sử dụng
      next();  // Chuyển sang middleware tiếp theo
    } else {
      return res.status(403).json({
        message: "Người dùng không phải admin",
        status: "ERROR"
      });
    }
  });
};


// Kiểm tra là vendor
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

// Middleware kiểm tra quyền User
const isUserMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      status: "error",
      message: "Không có token trong header",
    });
  }

  const token = authHeader.split(" ")[1];
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({
      status: "error",
      message: "Không tìm thấy người dùng",
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).json({
        status: "error",
        message: "Token không hợp lệ",
      });
    }

    // user ở đây chính là payload khi sign
    if (user?.id?.toString() === userId.toString()) {
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
