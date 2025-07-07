const UserControllers = require("../../controllers/Customer/UserControllers");
const express = require("express");
const {verifyToken} = require("../../middleware/authMiddleware");

const route = express.Router();

route.get(
    "/get-detail-account",
    verifyToken,
    UserControllers.getDetailAccountUser
);

route.patch(
    "/partial-update",
    verifyToken,
    UserControllers.partialUpdateUser
); //cập nhật 1 thành phần

route.post("/add-wish-list", verifyToken, UserControllers.addWishlist)

route.patch("/remove-wish-list", verifyToken, UserControllers.removeWishlist);

route.patch("/change-password", verifyToken, UserControllers.changePassword);

module.exports = route;
