const express = require("express");
const router = express.Router();
const { isVendorMiddleware } = require("../../middleware/authMiddleware");
const OrderProductController = require("../../controllers/Vendor/OrderProductController");

router.get(
  "/get-all-order",
  isVendorMiddleware,
  OrderProductController.getAllOrderProducts
);

module.exports = router;
