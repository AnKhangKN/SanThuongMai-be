const mongoose = require("mongoose");

const platformFeesSchema = new mongoose.Schema({
  feeType: {
    type: String,
    enum: ["percentage", "fixed"], // 'percentage' = phần trăm, 'fixed' = cố định
    required: true,
  },
  amount: {
    type: Number,
    required: true, // Nếu là 'percentage' thì là %, nếu là 'fixed' thì là số tiền cố định
  },
  applicableTo: {
    type: String,
    enum: ["product", "order", "vendor", "category"],
    required: true, // Phí áp dụng cho loại gì
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null, // Nếu không áp dụng theo danh mục thì để null
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    default: null, // Nếu không áp dụng cho một vendor cụ thể thì để null
  },
  description: {
    type: String,
    default: "",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const PlatformFee = mongoose.model("PlatformFee", platformFeesSchema);

module.exports = PlatformFee;
