const express = require("express");
const { isAdminMiddleware, verifyToken, isAdmin} = require("../../middleware/authMiddleware");
const PlatformFeesControllers = require("../../controllers/Admin/PlatformFeesControllers");

const route = express.Router();

// Lấy tất cả các phí nền tảng
route.get("/get-all-fees",verifyToken, isAdmin, PlatformFeesControllers.getAllFees);

// Tạo một phí nền tảng mới
route.post("/create-fee", verifyToken, isAdmin,PlatformFeesControllers.createPlatformFee);

route.patch("/update-fee/:id", verifyToken, isAdmin, PlatformFeesControllers.updatePlatformFee);

module.exports = route;
