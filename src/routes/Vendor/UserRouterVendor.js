const express = require("express");
const User = require("../../models/User");
const router = express.Router();
const UserVendorController = require("../../controllers/Vendor/UserVendorController");

router.put("/add-vendor/:id", UserVendorController.createVendor);

module.exports = router;
