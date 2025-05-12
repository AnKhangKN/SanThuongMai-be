const UserControllers = require("../../controllers/Customer/UserControllers");
const express = require("express");
const {isUserMiddleware} = require("../../middleware/authMiddleware");

const route = express.Router();

route.get(
    "/get-detail-account/:id",
    isUserMiddleware,
    UserControllers.getDetailAccountUser
); // GET /get-detail-user/:id (vendor, admin, customer)

route.post(
    "/update-account/:id",
    isUserMiddleware,
    UserControllers.updateAccountUser
); // POST/ update-account/:id (name, phone, ...) (vendor, admin, customer)

route.patch(
    "/partial-update/:id",
    isUserMiddleware,
    UserControllers.partialUpdateUser
); //cập nhật 1 thành phần

route.post("/add-wish-list", isUserMiddleware, UserControllers.addWishlist)

module.exports = route;
