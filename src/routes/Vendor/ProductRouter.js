const express = require("express");
const router = express.Router();
const ProductController = require("../../controllers/Vendor/ProductController");
const { isVendorMiddleware } = require("../../middleware/authMiddleware");

router.post(
  "/add-product",
  isVendorMiddleware,
  ProductController.createProduct
);
router.put(
  "/update-product/:id",
  isVendorMiddleware,
  ProductController.updateProduct
);

module.exports = router;
