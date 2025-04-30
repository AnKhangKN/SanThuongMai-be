const express = require("express");
const {isAdminMiddleware} = require("../../middleware/authMiddleware");
const ShopControllers = require("../../controllers/Admin/ShopControllers");

const route = express.Router();

// shop router
route.get("/get-all-shops", isAdminMiddleware, ShopControllers.getAllShops);

route.patch(
    "/partial-update-shop/:id",
    isAdminMiddleware,
    ShopControllers.partialUpdateShop
); // cập nhật trạng thái shop.status

module.exports = route;
