const express = require("express");
const routes = express.Router();
const GenerateLogControllers = require("../../controllers/TrainingAi/GenerateLogControllers")
const {verifyAi} = require("../../middleware/authMiddleware");

routes.post("/products/view-log", verifyAi, GenerateLogControllers.addProductViewLog);

routes.post("/search/key-word", verifyAi, GenerateLogControllers.addSearchKeyLog);

module.exports = routes;