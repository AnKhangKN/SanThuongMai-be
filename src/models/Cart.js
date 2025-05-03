const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      items: [
        {
          product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
            product_name: {type: String},
          size: { type: String, },
          color: { type: String, },
          price: { type: Number, required: true },
          quantity: { type: Number, required: true, min: 1 },
            owner_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", // đúng tên model người bán
                required: true,
            },
            shop_name: { type: String },
            product_img: { type: String },
        },
      ],
    },
    {
      timestamps: true,
    }
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
