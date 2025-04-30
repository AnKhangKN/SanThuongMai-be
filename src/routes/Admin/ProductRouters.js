const express = require("express");
const {isAdminMiddleware} = require("../../middleware/authMiddleware");
const ProductControllers = require("../../controllers/Admin/ProductControllers");

const route = express.Router();

// products route
route.get("/get-all-products", isAdminMiddleware, ProductControllers.getAllProducts);

route.patch("/partial-update-product/:id", isAdminMiddleware,
    ProductControllers.partialUpdateProduct)

route.get("/get-all-reported-products", isAdminMiddleware, ProductControllers.getAllReportedProducts)

module.exports = route;