const express = require("express");
const CategoryControllers = require("../../controllers/Admin/CategoryControllers");
const {verifyToken, isAdmin} = require("../../middleware/authMiddleware");

const routes = express.Router();

routes.get("/get-all-categories", verifyToken, isAdmin ,CategoryControllers.getAllCategories);

routes.post("/categories", verifyToken, isAdmin, CategoryControllers.createCategory);

routes.put('/categories', verifyToken, isAdmin, CategoryControllers.updateCategory);

module.exports = routes;

