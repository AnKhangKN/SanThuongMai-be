const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema(
    {
        shop_name: {type: String, required: true},
        phone: {type: String, required: true},
        address: {type: String, required: true},
        status: {
            type: String,
            enum: ["active", "inactive", "pending", "banned"],
            default: "pending",
        },

        total_order: {type: Number, default: 0},
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // Bị người dùng báo cáo và bị cấm theo thời gian
        banned_until: {type: Date, default: null},

        // Các báo cáo không bắt buộc
        reports: [
            {
                userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
                reason: {type: String, required: true},
                createdAt: {type: Date, default: Date.now},
            },
        ],
    },
    {timestamps: true}
);

const Shop = mongoose.model("Shop", shopSchema);
module.exports = Shop;
