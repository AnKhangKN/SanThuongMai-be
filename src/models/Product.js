const mongoose = require("mongoose");

const attributeSchema = new mongoose.Schema(
    {
        name: {type: String, required: true, trim: true},
        value: {type: String, required: true, trim: true},
    },
    {_id: false}
);

// Nhiều thuộc tính + giá + số lượng tồn
const priceOptionSchema = new mongoose.Schema(
    {
        attributes: [attributeSchema],
        price: {type: Number, required: true, min: 0},
        salePrice: {type: Number, required: false, min: 0},
        stock: {type: Number, required: true, min: 0},
    },
    {_id: false}
);

// Schema chính của sản phẩm
const productSchema = new mongoose.Schema(
    {
        productName: {type: String, required: true, trim: true},

        images: {
            type: [String],
            default: [],
        },

        categoryId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        description: {type: String, required: false},

        shopId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shop",
            required: true,
        },

        priceOptions: {
            type: [priceOptionSchema],
            validate: [
                (v) => v.length > 0,
                "Sản phẩm phải có ít nhất một biến thể giá",
            ],
        },

        // Số lượng đã bán được
        soldCount: {type: Number, default: 0}, 

        status: {
            type: String,
            enum: ["active", "inactive", "banned"],
            default: "active",
        },

        bannedUntil: {type: Date},

        adminWarnings: [
            {
                message: {type: String},
                adminId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
                createdAt: {type: Date, default: Date.now},
            },
        ],

        // Điểm trung bình của sản phẩm
        numRating: {type: Number, default: 0},

        followers: {type: Number, default: 0},

        reports: [
            {
                userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
                reason: {type: String}, // Lý do
                createdAt: {type: Date, default: Date.now},
                status: {
                    type: String,
                    enum: ["pending", "resolved", "dismissed"],
                    default: "pending",
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
