const express = require("express");
const OrderControllers = require("../../controllers/Customer/OrderControllers");
const {verifyToken} = require("../../middleware/authMiddleware");

const route = express.Router();

route.get("/get-all-shipping-address",verifyToken, OrderControllers.getAllShippingCustomer);

route.patch("/add-shipping-addresses", verifyToken, OrderControllers.addShippingCustomer);

route.post("/order-product", verifyToken, OrderControllers.orderProduct);

route.get("/get-all-order", verifyToken, OrderControllers.getAllOrderByStatus)

route.patch("/successful-delivered", verifyToken, OrderControllers.successfulDelivered)

route.patch("/cancel-order", verifyToken, OrderControllers.cancelOrder);

route.patch("/remove-shipping-address", verifyToken, OrderControllers.removeShippingAddress);

route.post("/orders/return", verifyToken, OrderControllers.returnOrder);

module.exports = route;