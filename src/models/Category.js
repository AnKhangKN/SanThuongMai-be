const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },

    description: {
        type: String,
    },

    vat: {
        type: Number, // phần trăm VAT
        default: 0,   // ví dụ: 10 = 10%
    },

    platformFee: {
        type: Number, // phần trăm phí sàn
        default: 5,   // ví dụ: 5%
    },

    otherFees: [
        {
            name: { type: String },
            amount: { type: Number }, // cố định hoặc %
            isPercentage: { type: Boolean, default: false }, // true nếu là %
        }
    ],

    isActive: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;