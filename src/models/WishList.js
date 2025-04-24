const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        products: [
            {
                product_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: false,  // Có thể bỏ sản phẩm ra khỏi wishlist
                },
                added_at: {
                    type: Date,
                    default: Date.now,  // Thời gian thêm sản phẩm vào wishlist
                },
            },
        ],
        shop: [
            {
                shop_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Shop",
                    required: false, // Có thể bỏ shop khỏi wishlist
                },
                added_at: {
                    type: Date,
                    default: Date.now, // Thời gian thêm shop vào wishlist
                },
            },
        ],
    },
    {
        timestamps: true,  // Tự động lưu thời gian tạo và cập nhật
    }
);

const WishList = mongoose.model("WishList", wishListSchema);

module.exports = WishList;
