const express = require("express");
const UserControllers = require("../../controllers/Admin/UserControllers");
const {isAdminMiddleware} = require("../../middleware/authMiddleware");

const route = express.Router();

route.patch(
    "/partial-update-user/:id",
    isAdminMiddleware,
    UserControllers.partialUpdateUser
); // cập nhật trạng thái user account_status

route.get("/get-all-users", isAdminMiddleware, UserControllers.getAllUser);

route.delete("/delete-user/:id", isAdminMiddleware, UserControllers.deleteUser); // kiểm tra quyền trước khi xóa

module.exports = route;
