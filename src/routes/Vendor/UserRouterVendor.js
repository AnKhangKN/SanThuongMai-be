const express = require("express");
const router = express.Router();
const UserVendorController = require("../../controllers/Vendor/UserVendorController");
const multerConfigAvatar = require("../../middleware/multerConfigAvatar");
const {verifyToken, isVendor} = require("../../middleware/authMiddleware");

router.post(
  "/add-vendor",
  verifyToken,
  multerConfigAvatar,
  UserVendorController.createVendor
);

router.get("/get-vendor", verifyToken, isVendor,  UserVendorController.getVendor);

module.exports = router;
