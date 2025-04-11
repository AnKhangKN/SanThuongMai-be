const UserController = require("../../controllers/Customer/UserControllers");
const express = require("express");

const router = express.Router();

router.post("/sign-up", UserController.createUser); // đăng kí

router.put("/update/:id", UserController.updateUser); // cập nhật toàn bộ thông tin user (name, email, phone, ...)

router.patch("/partial-update/:id", UserController.partialUpdateUser); //cập nhật email hoặc mật khẩu hoặc 1 thành phần

router.get("/get-detail/:id", UserController.getDetailUser); // show user detail

router.post("/login", UserController.loginUser); // đăng nhập

router.post("/refresh-token", UserController.refreshToken); // refresh token

module.exports = router;
