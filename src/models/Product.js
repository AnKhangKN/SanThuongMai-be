const mongoose = require("mongoose");

// Thuộc tính động
const attributeSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
}, { _id: false });

// Nhiều thuộc tính + giá + số lượng tồn
const priceOptionSchema = new mongoose.Schema({
    attributes: [attributeSchema],
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
}, { _id: false });

// Schema chính của sản phẩm
const productSchema = new mongoose.Schema({
    product_name: { type: String, required: true },

    images: {
        type: [String],
        default: [],
    },

    category: { type: String, required: true },

    description: { type: String, required: false },

    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    price_options: [priceOptionSchema],

    // Lượng bán
    sold_count: { type: Number, default: 0 },

    status: {
        type: String,
        enum: ["active", "inactive", "banned"],
        default: "active",
    },

    banned_until: { type: Date },

    admin_warnings: [{
        message: { type: String },
        // admin nào báo cảnh báo
        admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now }
    }],

    // điểm sản phẩm
    rating: { type: Number, default: 0, min: 0, max: 5 },

    // điểm trung bình
    num_ratings: { type: Number, default: 0 },

    followers: { type: Number, default: 0 },

    reports: [
        {
            // ai là người report
            reporter_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

            reason: { type: String }, // Lý do

            createdAt: { type: Date, default: Date.now },

            status: {
                type: String,
                enum: ["pending", "resolved", "dismissed"],
                default: "pending",
            },
        },
    ],

}, {
    timestamps: true,
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
