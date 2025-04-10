const userController = require("../../controllers/Customer/UserControllers");

const express = require("express");
const { isAdminMiddleware } = require("../../middleware/authMiddleware");
const router = express.Router();

router.post("/create", userController.createUser);

router.put("/update/:id", userController.updateUser); // cập nhật toàn bộ thông tin user (name, email, phone, ...)

router.delete("/delete/:id", isAdminMiddleware, userController.deleteUser); // kiểm tra quyền trước khi xóa

router.get("/getAll", isAdminMiddleware, userController.getAllUser);

router.get("/get-detail/:id", userController.getDetailUser);

router.post("/login", userController.loginUser);

router.post("/refresh-token", userController.refreshToken);

module.exports = router;
