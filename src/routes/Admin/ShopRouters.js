const express = require("express");
const ShopControllers = require("../../controllers/Admin/ShopControllers");
const {isAdminMiddleware} = require("../../middleware/authMiddleware");

const route = express.Router();

// get All Violated Shops
route.patch("get-all-shops", isAdminMiddleware, ShopControllers.getAllViolatedShops);

// Set status shop
route.patch("/partial-update-shop/:id", isAdminMiddleware,
    ShopControllers.partialUpdateShop);