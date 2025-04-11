const UserControllers = require("../../controllers/Customer/UserControllers");
const express = require("express");
const { isUserMiddleware } = require("../../middleware/authMiddleware");

const route = express.Router();

route.post("/sign-up", UserControllers.createUser); // đăng kí

route.put("/update/:id", isUserMiddleware, UserControllers.updateUser); // cập nhật toàn bộ thông tin user (name, email, phone, ...)

route.patch(
  "/partial-update/:id",
  isUserMiddleware,
  UserControllers.partialUpdateUser
); //cập nhật 1 thành phần

route.get("/get-detail/:id", isUserMiddleware, UserControllers.getDetailUser); // show user detail

module.exports = route;
