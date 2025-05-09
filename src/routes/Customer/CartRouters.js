const express = require("express");
const CartController = require("../../controllers/Customer/CartControllers");
const { isUserMiddleware } = require("../../middleware/authMiddleware");

const route = express.Router();

route.post("/add-to-cart/:id", isUserMiddleware, CartController.addToCart );

route.get("/get-all-items",isUserMiddleware, CartController.getAllItems);

route.patch("/update-quantity",isUserMiddleware, CartController.updateCartQuantity);

route.delete("/delete-item",isUserMiddleware, CartController.deleteCartItem);

route.get("/best-product-in-cart", CartController.getProductBestSellersInCart); // rảnh làm tiếp

module.exports = route;