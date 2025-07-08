const mongoose = require("mongoose");

const attributeSchema = new mongoose.Schema({
    name: String,
    value: String,
}, { _id: false });

const productItemsSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    productName: { type: String, required: true },

    productImage: { type: String, required: true },

    attributes: [attributeSchema],

    price: { type: Number, required: true, min: 0 },

    quantity: { type: Number, required: true, min: 1 },

    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true,
    },
    shopName: { type: String, required: true },

}, { _id: false });

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        productItems: [productItemsSchema],
    },
    {
        timestamps: true,
    }
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
