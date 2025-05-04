const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {

        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }, // Ai là người đặt hàng dùng để truy vấn shipping_address nếu có

        shipping_address: {
            phone: {type: String, required: true},
            address: {type: String, required: true},
            city: {type: String, required: true},
        }, // Địa chỉ mới hoặc chưa thêm địa chỉ -> sao khi nhập sẽ lưu lại địa chỉ vào bảng user

        items: [
            {
                product_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },

                product_image: {type: String, required: true},

                size: {type: String, required: false},

                color: {type: String, required: false},

                price: { type: Number,required: true },

                quantity: { type: Number,required: true },

                owner_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                }, // Sản phẩm này của ai ( có nhiều người bán )
            },
        ],
        total_price: { type: Number,required: true,}, // Tổng tiền đơn hàng

        tax_price: { type: Number,required: true, }, // Phí thuế

        shipping_price: { type: Number, required: true}, // Phí giao hàng

        payment_method: {
            type: String,
            enum: ["cod", "credit_card"],
            default: "cod",
            required: true,
        },

        is_paid: {
            type: Boolean,
            default: false,
        }, // Nếu chuyển khoản thì đã chuyển hay chưa

        paid_at: {
            type: Date,
        }, // Chuyển lúc nào

        platform_fee:{
            platform_fee_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "PlatformFee",
            },
            value: {
                type: Number,
                required: true,
            },
            fee_type: {
                type: String,
                enum: ["percentage", "fixed"],
                required: true,
            },
        },

        // Trạng thái đơn hàng
        status: {
            type: String,
            enum: ["pending", "processing", "shipped", "delivered", "cancelled"],

            // Chờ vendor duyệt sẽ chuyển nó thành processing sao đó "shipper" (vendor) sẽ chuyển thành shipped
            // Nếu là processing thì người dùng sẽ có quyền chuyển thành cancelled
            // Nếu là shipped thì người dùng chỉ có thể chuyển thành delivered không thể cancelled

            default: "pending",
            required: true,
        },

        cancel_reason: {
            type: String,
            required: false,
        }, // Nếu hủy thì lý do là gì

        delivered_at: {
            type: Date,
            required: false,
        }, // Ngày nhận hàng

    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
