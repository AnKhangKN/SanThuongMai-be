const express = require("express");
const {isAdminMiddleware} = require("../../middleware/authMiddleware");
const ProductControllers = require("../../controllers/Admin/ProductControllers");
const ShopControllers = require("../../controllers/Admin/ShopControllers");

const route = express.Router();

// shop router
route.get("/get-all-products", isAdminMiddleware, ProductControllers.getAllProducts);

route.patch("/partial-update-product/:id", isAdminMiddleware,
    ProductControllers.partialUpdateProduct)

module.exports = route;