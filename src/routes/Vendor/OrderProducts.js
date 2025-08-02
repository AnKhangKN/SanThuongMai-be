const express = require("express");
const router = express.Router();
const { verifyToken, isVendor } = require("../../middleware/authMiddleware");
const OrderProductController = require("../../controllers/Vendor/OrderProductController");
const Order = require("../../models/Order");

router.get(
  "/get-all-order",
  verifyToken,
  isVendor,
  OrderProductController.getAllOrderProducts
);

router.get("/get-buyers", OrderProductController.getBuyersInfo);

router.put(
  "/change-status",
  verifyToken,
  isVendor,
  OrderProductController.changeStatusOrder
);

router.put(
  "/update-status/:orderId",
  verifyToken,
  isVendor,
  OrderProductController.updateStatusOrder
);

module.exports = router;
