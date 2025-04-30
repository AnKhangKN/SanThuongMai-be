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

        cccd: { type: String, required: false},

        shop: {
            name: { type: String, required: false },
            phone: { type: String, required: false },
            address: { type: String, required: false },
            status: {
                type: String,
                enum: ["active", "inactive", "pending", "banned"],
                required: false,
            }, // admin set
            total_order: { type: Number, min: 0, default: 0, required: false },

            banned_until: {type: Date, required: false},  // Cấm cửa hàng theo thời gian (admin set)

            comment_reported: [
                {type: String, required: false},
            ], // Cảnh báo của admin gửi cho vendor

            reports: [
                {
                    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                    reason: { type: String, required: false },
                    createdAt: { type: Date, default: Date.now, required: false },  // Tự động set ngày giờ tạo báo cáo
                },
            ],
        },
    },
    {
        timestamps: true,  // Tự động tạo createdAt và updatedAt
    }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
