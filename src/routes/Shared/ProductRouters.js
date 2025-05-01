const express = require("express");
const ProductControllers = require("../../controllers/Shared/ProductControllers");

const route = express.Router();

// products route
route.get("/get-all-products", ProductControllers.getAllProducts);

module.exports = route;