const express = require("express");
const router = express.Router();
const UserVendorController = require("../../controllers/Vendor/UserVendorController");
const multerConfigAvatar = require("../../middleware/multerConfigAvatar");
const { isVendor, verifyToken } = require("../../middleware/authMiddleware");

router.post(
  "/add-vendor",
  verifyToken,
  isVendor,
  multerConfigAvatar,
  UserVendorController.createVendor
);

router.get(
  "/get-vendor",
  verifyToken,
  isVendor,
  UserVendorController.getVendor
);

router.put(
  "/update-vendor",
  verifyToken,
  isVendor,
  UserVendorController.updateVendor
);

router.put(
  "/update-avatar-vendor",
  verifyToken,
  isVendor,
  multerConfigAvatar,
  UserVendorController.updateAvatarVendor
);

module.exports = router;
