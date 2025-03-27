const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    images: [{ type: String, required: true }], // chứa nhiều ảnh
    details: [
      {
        size: { type: String, required: true },
        color: { type: String, required: true },
        price: { type: Number, required: true, min: 0 }, // Không cho giá trị âm
        quantity: { type: Number, required: true, min: 0 }, // Không cho số lượng âm
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "pending",
    },
    review_count: { type: Number, default: 0, min: 0 }, // Không cho giá trị âm
    shop_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    }, // Liên kết với Shop
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
