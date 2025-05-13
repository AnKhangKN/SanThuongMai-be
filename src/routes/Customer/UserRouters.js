const UserControllers = require("../../controllers/Customer/UserControllers");
const express = require("express");
const {isUserMiddleware} = require("../../middleware/authMiddleware");

const route = express.Router();

route.get(
    "/get-detail-account/:id",
    isUserMiddleware,
    UserControllers.getDetailAccountUser
); // GET /get-detail-user/:id (vendor, admin, customer)

route.patch(
    "/partial-update",
    isUserMiddleware,
    UserControllers.partialUpdateUser
); //cập nhật 1 thành phần

route.post("/add-wish-list", isUserMiddleware, UserControllers.addWishlist)

module.exports = route;
