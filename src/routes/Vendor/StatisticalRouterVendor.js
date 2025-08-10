const express = require("express");
const router = express.Router();
const { verifyToken, isVendor } = require("../../middleware/authMiddleware");
const vendorStatsCtrl = require("../../controllers/Vendor/vendorStatsController");

router.get(
  "/statistics/summary",
  verifyToken,
  isVendor,
  vendorStatsCtrl.getSummary
);

router.get(
  "/statistics/revenue",
  verifyToken,
  isVendor,
  vendorStatsCtrl.getRevenueTrend
);

router.get(
  "/statistics/orders-by-status",
  verifyToken,
  isVendor,
  vendorStatsCtrl.getOrdersByStatus
);

router.get(
  "/statistics/top-products",
  verifyToken,
  isVendor,
  vendorStatsCtrl.getTopProducts
);

router.get(
  "/statistics/low-stock",
  verifyToken,
  isVendor,
  vendorStatsCtrl.getLowStock
);

router.get(
  "/statistics/warnings",
  verifyToken,
  isVendor,
  vendorStatsCtrl.getWarnings
);

module.exports = router;
