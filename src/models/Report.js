const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shop_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      default: null,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    reason: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
