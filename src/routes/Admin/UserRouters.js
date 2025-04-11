const express = require("express");
const UserController = require("../../controllers/Admin/UserController");
const { isAdminMiddleware } = require("../../middleware/authMiddleware");

const router = express.Router();

router.put("/banned-user/:id", isAdminMiddleware, UserController.bannedUser); // cập nhật account_status: banned

router.get("/getAll", isAdminMiddleware, UserController.getAllUser);

router.delete("/delete/:id", isAdminMiddleware, UserController.deleteUser); // kiểm tra quyền trước khi xóa

module.exports = router;
