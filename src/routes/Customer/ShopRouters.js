const express = require("express");
const ShopControllers = require("../../controllers/Customer/ShopControllers");

const route = express.Router();

route.get("/get-detail-shop/:id", ShopControllers.getShopDetail)

module.exports = route;