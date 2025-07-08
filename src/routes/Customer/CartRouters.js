const express = require("express");
const CartController = require("../../controllers/Customer/CartControllers");
const {verifyToken, isUser} = require("../../middleware/authMiddleware");


const route = express.Router();

route.post("/add-to-cart", verifyToken ,isUser, CartController.addToCart );

route.get("/get-all-items",verifyToken, CartController.getAllItems);

route.patch("/update-quantity",verifyToken, CartController.updateCartQuantity);

route.delete("/delete-item",verifyToken, CartController.deleteCartItem);

route.get("/best-product-in-cart", CartController.getProductBestSellersInCart); // rảnh làm tiếp

module.exports = route;