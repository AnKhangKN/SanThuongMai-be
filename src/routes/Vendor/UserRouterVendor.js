const express = require("express");
const router = express.Router();
const UserVendorController = require("../../controllers/Vendor/UserVendorController");
const multerConfigAvatar = require("../../middleware/multerConfigAvatar");
<<<<<<< HEAD
const {verifyToken, isVendor} = require("../../middleware/authMiddleware");
=======
const { isVendor, verifyToken } = require("../../middleware/authMiddleware");
>>>>>>> 99f9822c854bcd88108e28b9d8e81f9db4a3c397

router.post(
  "/add-vendor",
  verifyToken,
  isVendor,
  multerConfigAvatar,
  UserVendorController.createVendor
);

<<<<<<< HEAD
router.get("/get-vendor", verifyToken, isVendor,  UserVendorController.getVendor);
=======
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
>>>>>>> 99f9822c854bcd88108e28b9d8e81f9db4a3c397

module.exports = router;
