const express = require("express");
const PromotionControllers = require('../../controllers/Admin/PromotionControllers')

const route = express.Router();

route.post("/banner", PromotionControllers.createBanner);

module.exports = route;