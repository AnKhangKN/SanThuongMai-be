const express = require('express');
const {isAdminMiddleware, verifyToken, isAdmin} = require("../../middleware/authMiddleware");
const HomeController = require("../../controllers/Admin/HomeControllers");

const route = express.Router();

route.get("/get-all-home", verifyToken, isAdmin, HomeController.getAllHome);

module.exports = route;