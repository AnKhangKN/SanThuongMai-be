const express = require("express");
const ProductControllers = require("../../controllers/Shared/ProductControllers");

const route = express.Router();

// products route
route.get("/get-all-products", ProductControllers.getAllProducts);

route.get("/search-products", ProductControllers.searchProducts);

module.exports = route;