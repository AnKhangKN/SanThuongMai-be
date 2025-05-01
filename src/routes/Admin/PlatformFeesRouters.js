const express = require("express");
const { isAdminMiddleware } = require("../../middleware/authMiddleware");
const PlatformFeesControllers = require("../../controllers/Admin/PlatformFeesControllers");

const route = express.Router();

// Lấy tất cả các phí nền tảng
route.get("/get-all-fees", isAdminMiddleware, PlatformFeesControllers.getAllFees);

// Tạo một phí nền tảng mới
route.post("/create-fee", isAdminMiddleware, PlatformFeesControllers.createPlatformFee);

route.patch("/update-fee/:id", isAdminMiddleware, PlatformFeesControllers.updatePlatformFee);

module.exports = route;
