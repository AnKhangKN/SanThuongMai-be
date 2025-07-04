const express = require("express");
const {isAdminMiddleware} = require("../../middleware/authMiddleware");
const ShopControllers = require("../../controllers/Admin/ShopControllers");

const route = express.Router();

route.get("/get-all-shops", isAdminMiddleware, ShopControllers.getAllShops);

route.patch('/shop', isAdminMiddleware, ShopControllers.activateShop);

module.exports = route;
