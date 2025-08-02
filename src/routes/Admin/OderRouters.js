const express = require('express');
const { verifyToken, isAdmin} = require("../../middleware/authMiddleware");
const OrderController = require("../../controllers/Admin/OrderControllers");

const route = express.Router();

route.get("/get-all-order", verifyToken, isAdmin,OrderController.getAllOrder);

route.patch("/set-status-order", verifyToken, isAdmin, OrderController.setStatusOrder)

module.exports = route;