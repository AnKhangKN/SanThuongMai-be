const express = require("express");
const router = express.Router();
const { verifyToken, isVendor } = require("../../middleware/authMiddleware");
const vendorStatisticsController = require("../../controllers/Vendor/vendorStatsController");

router.get(
  "/statistics",
  verifyToken,
  isVendor,
  vendorStatisticsController.getStatistics
);

module.exports = router;
