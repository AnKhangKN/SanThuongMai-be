const express = require('express');
const {isAdminMiddleware} = require("../../middleware/authMiddleware");
const HomeController = require("../../controllers/Admin/HomeControllers");

const route = express.Router();

route.get("/get-all-home", isAdminMiddleware, HomeController.getAllHome);

module.exports = route;