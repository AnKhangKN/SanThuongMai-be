const UserControllers = require("../../controllers/Customer/UserControllers");
const express = require("express");
const { isUserMiddleware } = require("../../middleware/authMiddleware");

const route = express.Router();

route.patch(
  "/partial-update/:id",
  isUserMiddleware,
  UserControllers.partialUpdateUser
); //cập nhật 1 thành phần

module.exports = route;
