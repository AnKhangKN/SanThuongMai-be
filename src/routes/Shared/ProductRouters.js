const express = require("express");
const ProductControllers = require("../../controllers/Shared/ProductControllers");

const route = express.Router();

// products route
route.get("/get-all-products", ProductControllers.getAllProducts);

route.get("/top-search-product", ProductControllers.getTopSearchProduct);

route.get("/get-all-categories-home", ProductControllers.getAllCategoriesHome);

route.get("/search-products", ProductControllers.searchProducts);

route.get("/get-detail-product/:id", ProductControllers.getDetailProduct);

module.exports = route;