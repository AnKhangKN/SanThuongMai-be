const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        product_name: { type: String, required: true },
        description: { type: String, required: false }, // Nếu mô tả sản phẩm cần thiết, bạn có thể set thành required: true
        category: { type: String, required: true },
        images: { type: [String], required: true, default: [] }, // có thể thêm 1 hoặc nhiều ảnh

        details: [
            {
                size: { type: String }, //30
                color: { type: String }, //đỏ
                price: { type: Number, required: true, min: 0 }, //23
                quantity: { type: Number, required: true, min: 0 },
            }

        ],

        status: {
            type: String,
            enum: ["active", "inactive", "pending", "banned"],
            default: "pending",
        },

        rating: { type: Number, default: 0, min: 0, max: 5 },

        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        sale: {
            price: { type: Number, min: 0 },
            start_date: { type: Date },
            end_date: { type: Date },
        },

        banned_until: {
            type: Date,
            required: false,  // Trường này sẽ giúp admin quản lý thời gian cấm sản phẩm
        },

        reports: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                reason: { type: String }, // Lý do
                createdAt: { type: Date, default: Date.now },
                status: {
                    type: String,
                    enum: ["pending", "resolved", "dismissed"],
                    default: "pending",
                },
            },
        ],

        sold_count: { type: Number, default: 0, min: 0 }, // Lượt bán

    },
    {
        timestamps: true, // Tự động tạo createdAt và updatedAt
    }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
