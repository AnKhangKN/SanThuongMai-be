const express = require("express");
const router = express.Router();
const UserVendorController = require("../../controllers/Vendor/UserVendorController");
const multerConfigAvatar = require("../../middleware/multerConfigAvatar");
const {
  isUserMiddleware,
  isVendorMiddleware,
} = require("../../middleware/authMiddleware");

router.post(
  "/add-vendor",
  isUserMiddleware,
  multerConfigAvatar,
  UserVendorController.createVendor
);

router.get("/get-vendor", isVendorMiddleware, UserVendorController.getVendor);

module.exports = router;
