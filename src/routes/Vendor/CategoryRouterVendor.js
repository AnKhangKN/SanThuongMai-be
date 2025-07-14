const express = require("express");
const router = express.Router();
const { verifyToken, isVendor } = require("../../middleware/authMiddleware");
const CategoryController = require("../../controllers/Vendor/CategoryController");

router.get(
  "/get-all-category",
  verifyToken,
  isVendor,
  CategoryController.getAllCategory
);

module.exports = router;
