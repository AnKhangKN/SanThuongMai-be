const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },

    comment: {
        type: String,
        default: "",
        maxlength: 1000
    },

    images: [{
        type: String,  // URL hoặc đường dẫn ảnh
    }],
}, {
    timestamps: true
});


const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
