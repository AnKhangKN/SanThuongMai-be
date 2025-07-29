const express = require("express");
const {
  isAdminMiddleware,
  verifyToken,
  isAdmin,
} = require("../../middleware/authMiddleware");
const ShopControllers = require("../../controllers/Admin/ShopControllers");

const route = express.Router();

route.get("/get-all-shops", verifyToken, isAdmin, ShopControllers.getAllShops);

route.patch("/shops", verifyToken, isAdmin, ShopControllers.activateShop);

module.exports = route;
