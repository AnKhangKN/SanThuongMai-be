const express = require("express");
const UserControllers = require("../../controllers/Admin/UserControllers");
const { verifyToken, isAdmin} = require("../../middleware/authMiddleware");

const route = express.Router();

// user router
route.patch(
    "/partial-update-user/:id",
    verifyToken, isAdmin,
    UserControllers.partialUpdateUser
); // cập nhật trạng thái user account_status

route.get("/get-all-users", verifyToken, isAdmin, UserControllers.getAllUser);

route.delete("/delete-user/:id", verifyToken, isAdmin, UserControllers.deleteUser);



module.exports = route;
