const express = require('express');
const {isAdminMiddleware} = require("../../middleware/authMiddleware");

const route = express.Router();

route.get("/get-all-reported-order", isAdminMiddleware, OrderController)