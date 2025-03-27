const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    shop_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    quantity_sold: {
      type: Number,
      required: true,
    },
    total_revenue: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0, // Giảm giá nếu có
    },
    sale_date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Sales = mongoose.model("Sales", salesSchema);
module.exports = Sales;
