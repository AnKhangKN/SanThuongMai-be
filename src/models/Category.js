const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        unique: true,
    },

    description: {
        type: String,
    },

    vat: {
        type: Number, // phần trăm VAT
        required: true,
    },

    platformFee: {
        type: Number, // phần trăm phí sàn
        required: true,
        default: 0,
    },

    typeFees: {
        type: String,
        enum: ["percent", "fixed"], // phần trăm hoặc cố định
        default: "fixed",
    },

    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
