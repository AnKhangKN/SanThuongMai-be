const express = require("express");
const router = express.Router();
const { isVendorMiddleware } = require("../../middleware/authMiddleware");
const ProductController = require("../../controllers/Vendor/ProductController");

router.post(
  "/add-product",
  isVendorMiddleware,
  ProductController.createProduct
);

router.put(
  "/update-product",
  isVendorMiddleware,
  ProductController.updateProduct
);

router.get(
  "/get-all-product",
  isVendorMiddleware,
  ProductController.getAllProduct
);

module.exports = router;
