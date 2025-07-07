const express = require("express");
const {isAdminMiddleware, verifyToken, isAdmin} = require("../../middleware/authMiddleware");
const ProductControllers = require("../../controllers/Admin/ProductControllers");

const route = express.Router();

// products route
route.get("/get-all-products", verifyToken, isAdmin, ProductControllers.getAllProducts);

route.patch("/partial-update-product/:id", verifyToken, isAdmin,
    ProductControllers.partialUpdateProduct)

route.get("/get-all-reported-products", verifyToken, isAdmin, ProductControllers.getAllReportedProducts)

module.exports = route;