const express = require("express");
const CartController = require("../../controllers/Customer/CartControllers");
const { isUserMiddleware } = require("../../middleware/authMiddleware");

const route = express.Router();

route.post(
    "/add-to-cart/:id",
    isUserMiddleware,
    CartController.addToCart
);

module.exports = route;