const {verifyToken, isUser} = require("../../middleware/authMiddleware");
const VoucherControllers = require("../../controllers/Customer/VoucherControllers");
const express = require("express");
const routes = express.Router();

routes.get("/vouchers",  verifyToken, isUser, VoucherControllers.getVouchers);

module.exports = routes