const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        user_name: {type: String, required: false, default: "Khách hàng"},
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {type: String, required: true},
        phone: {
            type: String,
            required: false,
        },
        images: [
            {
                type: String, // link ảnh người dùng
                required: false,
            },
        ],
        account_status: {
            type: String,
            enum: ["active", "inactive", "banned"],
            default: "active",
            required: true,
        },

        isAdmin: {type: Boolean, default: false},

        access_token: {type: String},

        refresh_token: {type: String},

        wallet: {type: Number, default: 0},

        // Vendor cần đầy đủ các thuộc tính này
        isVendor: {type: Boolean, default: false},

        cccd: { type: String, required: false,},

        shop: {
            name: { type: String,required: false },
            phone: { type: String,required: false },
            address: { type: String,required: false },
            status: {
                type: String,
                enum: ["active", "inactive", "pending", "banned"],
                default: "pending",
            },
            total_order: { type: Number, default: 0 },
        },


        // Bị người dùng báo cáo và bị cấm theo thời gian (admin set)
        banned_until: {type: Date, default: null},

        // Các báo cáo không bắt buộc (admin xem xét)
        reports: [
            {
                userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
                reason: {type: String, required: true},
                createdAt: {type: Date, default: Date.now},
            },
        ],


    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
