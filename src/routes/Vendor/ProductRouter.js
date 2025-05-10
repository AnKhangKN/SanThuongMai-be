const express = require("express");
const router = express.Router();
const { isVendorMiddleware } = require("../../middleware/authMiddleware");
const uploadImgProducts = require("../../middleware/multerConfigProduct");
const ProductController = require("../../controllers/Vendor/ProductController");

router.post(
  "/add-product",
  isVendorMiddleware, uploadImgProducts,
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
