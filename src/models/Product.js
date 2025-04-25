const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        product_name: {type: String, required: true},
        description: {type: String},
        category: {type: String, required: true},
        images: [{type: String, required: true}], // Chứa nhiều ảnh
        details: [
            {
                size: {type: String, required: false}, // Có thể là yêu cầu bắt buộc
                color: {type: String, required: false}, // Cũng có thể bắt buộc
                price: {type: Number, required: true, min: 0}, // Không cho giá trị âm
                quantity: {type: Number, required: true, min: 0}, // Không cho số lượng âm
            },
        ],
        status: {
            type: String,
            enum: ["active", "inactive", "pending", "banned"], // Có thể thêm trạng thái "banned"
            default: "pending",
        },

        rating: {type: Number, default: 0, min: 0}, // Không cho giá trị âm


        shop_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shop",
            required: true,
        }, // Liên kết với Shop

        sale: { // Thêm phần thông tin sale
            price: {type: Number, min: 0, required: false}, // Giá bán sau giảm
            start_date: {type: Date, required: false},
            end_date: {type: Date, required: false},
        },
    },
    {
        timestamps: true, // Thêm thông tin thời gian
    }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
