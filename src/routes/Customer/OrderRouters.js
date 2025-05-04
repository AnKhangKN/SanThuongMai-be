const express = require("express");
const {isUserMiddleware} = require("../../middleware/authMiddleware");
const OrderControllers = require("../../controllers/Customer/OrderControllers");

const route = express.Router();

route.get("/get-all-shipping-address",isUserMiddleware, OrderControllers.getAllShippingCustomer);

route.patch("/add-shipping-addresses", isUserMiddleware, OrderControllers.addShippingCustomer);

route.post("/order-product", isUserMiddleware, OrderControllers.orderProduct);

module.exports = route;