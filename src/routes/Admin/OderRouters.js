const express = require('express');
const {isAdminMiddleware} = require("../../middleware/authMiddleware");
const OrderController = require("../../controllers/Admin/OrderControllers");

const route = express.Router();

route.get("/get-all-order", isAdminMiddleware, OrderController.getAllOrder);

route.patch("/set-status-order", isAdminMiddleware, OrderController.setStatusOrder)

module.exports = route;