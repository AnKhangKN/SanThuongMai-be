const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    shop_name: { type: String, required: true },
    phone: {
      type: String,
      required: true,
    },
    address: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "pending", // cần admin xét duyệt
      required: true,
    },
    total_order: {
      type: Number,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Shop = mongoose.model("Shop", shopSchema);
module.exports = Shop;
