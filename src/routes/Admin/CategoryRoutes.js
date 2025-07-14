const express = require("express");
const CategoryControllers = require("../../controllers/Admin/CategoryControllers");
const {verifyToken, isAdmin} = require("../../middleware/authMiddleware");

const routes = express.Router();

routes.get("/categories",verifyToken, isAdmin ,CategoryControllers.getAllCategories);

module.exports = routes;

