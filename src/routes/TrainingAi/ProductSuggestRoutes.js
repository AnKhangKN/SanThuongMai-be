const express = require('express');
const ProductSuggestControllers = require("../../controllers/TrainingAi/ProductSuggestControllers");
const routes = express.Router();

routes.get("/products/suggest/:productId",  ProductSuggestControllers.productSuggest);

module.exports = routes;