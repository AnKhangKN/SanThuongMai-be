const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        product_name: { type: String, required: true },
        description: { type: String },
        category: { type: String, required: true },
        images: { type: [String], required: true, default: [] },

        details: [
            {
                size: { type: String },
                color: { type: String },
                price: { type: Number, required: true, min: 0 },
                quantity: { type: Number, required: true, min: 0 },
            },
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
    },
    {
        timestamps: true,
    }
);


const Product = mongoose.model("Product", productSchema);
module.exports = Product;
