const express = require("express");
const {isAdminMiddleware} = require("../../middleware/authMiddleware");
const ShopControllers = require("../../controllers/Admin/ShopControllers");

const route = express.Router();

// shop router
route.get("/get-all-shops", isAdminMiddleware, ShopControllers.getAllShops);

route.patch("/partial-update-shop/:id", isAdminMiddleware, ShopControllers.partialUpdateShop);

route.get("/get-all-reported-shops", isAdminMiddleware, ShopControllers.getAllReportedShops)

route.patch("/update-reported-shop/:id", isAdminMiddleware, ShopControllers.partialUpdateReportedShop);

module.exports = route;
