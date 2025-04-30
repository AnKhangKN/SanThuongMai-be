const express = require("express");
const UserControllers = require("../../controllers/Admin/UserControllers");
const {isAdminMiddleware} = require("../../middleware/authMiddleware");

const route = express.Router();

// user router
route.patch(
    "/partial-update-user/:id",
    isAdminMiddleware,
    UserControllers.partialUpdateUser
); // cập nhật trạng thái user account_status

route.get("/get-all-users", isAdminMiddleware, UserControllers.getAllUser);

route.delete("/delete-user/:id", isAdminMiddleware, UserControllers.deleteUser);



module.exports = route;
