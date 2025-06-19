const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }, // Ai đang order

        shipping_address: {
            phone: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
        }, // Vị trí cần ship

        shop_orders: [
            {
                owner_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                }, // Shop nào

                order_note: { type: String, required: false, default: "" }, // Ghi chú cho cả shop

                items: [
                    {
                        product_id: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: "Product",
                            required: true,
                        },

                        status: {
                            type: String,
                            enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
                            default: "pending",
                            required: true,
                        },

                        delivered_at: { type: Date }, // Ngày nhận
                        cancel_reason: { type: String }, // Nếu hủy là lý do hủy

                        product_image: { type: String, required: true },
                        product_name: { type: String, required: true },
                        size: { type: String },
                        color: { type: String },
                        price: { type: Number, required: true },
                        quantity: { type: Number, required: true },
                        total: { type: Number, required: true }, // Tổng tiền từng đơn
                    },
                ],
            },
        ],

        total_price: { type: Number, required: true },
        tax_price: { type: Number, required: true },
        shipping_price: { type: Number, required: true },

        payment_method: {
            type: String,
            enum: ["cod", "credit_card"],
            default: "cod",
            required: true,
        },

        is_paid: { type: Boolean, default: false },
        paid_at: { type: Date },

        platform_fee: {
            platform_fee_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "PlatformFee",
            },
            value: { type: Number, required: true },
            fee_type: {
                type: String,
                enum: ["percentage", "fixed"],
                required: true,
            },
        },
    },
    { timestamps: true }
);


const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
