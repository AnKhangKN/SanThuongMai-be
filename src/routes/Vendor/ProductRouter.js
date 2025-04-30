const express = require("express");
const route = express.Router();
const ProductController = require("../../controllers/Vendor/ProductController");

router.post("/add-product", ProductController.createProduct);
