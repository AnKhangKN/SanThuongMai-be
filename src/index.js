const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routes");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const http = require("http");
const { initSocket } = require("./utils/socket");

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
const server = http.createServer(app);

// Khởi tạo socket sau khi tạo HTTP server
initSocket(server);

// Cấu hình CORS cho phép frontend (React) truy cập
app.use(
  cors({
    origin: "http://localhost:3000", // Địa chỉ FE (React)
    credentials: true,
  })
);

app.use(bodyParser.json());

// Parse application/x-www-form-urlencoded (nếu cần thiết)
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

// Các routes API của bạn
routes(app);

// Cấu hình up ảnh
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// API để lấy ảnh avatar
app.get("/api/avatar/:filename", (req, res) => {
  const { filename } = req.params;

  // Đảm bảo đường dẫn file chính xác
  const filePath = path.join(__dirname, "/uploads/avatar/", filename);

  // Kiểm tra xem file có tồn tại không
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  // Nếu file tồn tại, trả về file
  res.sendFile(filePath);
});

// API để lấy ảnh sản phẩm
app.get("/api/products-img/:filename", (req, res) => {
  const { filename } = req.params;

  // Đảm bảo đường dẫn file chính xác
  const filePath = path.join(__dirname, "/uploads/products/", filename);

  // Kiểm tra xem file có tồn tại không
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  // Nếu file tồn tại, trả về file
  res.sendFile(filePath);
});

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("Connect DB success!");
  })
  .catch((err) => {
    console.log(err);
  });

// Khởi động server
server.listen(port, '0.0.0.0',() => { // Cho phép nội bộ 0.0.0.0
  console.log("Server is running on port: " + port);
});

