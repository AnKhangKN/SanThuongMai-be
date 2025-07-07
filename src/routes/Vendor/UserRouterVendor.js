const express = require("express");
const router = express.Router();
const UserVendorController = require("../../controllers/Vendor/UserVendorController");
const multerConfigAvatar = require("../../middleware/multerConfigAvatar");
const { isVendor } = require("../../middleware/authMiddleware");

router.post(
  "/add-vendor",
  isVendor,
  multerConfigAvatar,
  UserVendorController.createVendor
);

router.get("/get-vendor", isVendor, UserVendorController.getVendor);

module.exports = router;
