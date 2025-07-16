const express = require("express");
const {verifyToken, isAdmin} = require("../../middleware/authMiddleware");
const VoucherControllers = require("../../controllers/Admin/VoucherControllers")

const routes = express.Router();

routes.post("/vouchers",verifyToken, isAdmin,  VoucherControllers.createVoucher);

routes.get("/vouchers",  verifyToken, isAdmin, VoucherControllers.getVouchers); 

module.exports = routes;