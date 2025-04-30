const express = require("express");
const router = express.Router();
const ProductController = require("../../controllers/Vendor/ProductController");

router.post("/add-product", ProductController.createProduct);
router.put("/update-product/:id", ProductController.updateProduct);

module.exports = router;
