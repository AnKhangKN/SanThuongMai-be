const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shipping_address: {
      full_name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
    },
    items: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        product_name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
      },
    ],
    total_price: {
      type: Number,
      required: true,
    },
    payment_method: {
      type: String,
      enum: ["COD", "credit_card", "paypal"],
      default: "COD",
      required: true,
    },
    is_paid: {
      type: Boolean,
      default: false,
    },
    paid_at: {
      type: Date,
    },
    tax_price: {
      type: Number,
      required: true,
    }, // phí thuế
    shipping_price: {
      type: Number,
      required: true,
    }, // phí vận chuyển

    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
      required: true,
    },
    delivered_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
