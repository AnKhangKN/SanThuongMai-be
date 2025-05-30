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

        shipping_address: [
            {
                phone: {type: String,required: false,},
                address: {type: String, required: false},
                city: {type: String, required: false},
            }
        ], // Địa chỉ lưu mảng địa chỉ để có thể sử dụng khi giao hàng

        images: { type: String,required: false },

        account_status: {
            type: String,
            enum: ["active", "inactive", "banned"],
            default: "active",
            required: true,
        },

        isAdmin: {type: Boolean, default: false},

        access_token: {type: String},

        refresh_token: {type: String},

        email_verified: {type: Boolean, default: false},

        wallet: {type: Number, default: 0},

        wishlist: [
            {
                owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                shop_name: { type: String,required: false },
                owner_img: { type: String, required: false },
            },
        ],

        following: { type: Number,min: 0, default: 0, required: false },

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

            followers: { type: Number,min: 0, default: 0, required: false },

            created_at: { type: Date, default: Date.now },

            banned_until: {type: Date, required: false},  // Cấm cửa hàng theo thời gian (admin set)

            banned_count: { type: Number, required: false },

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
