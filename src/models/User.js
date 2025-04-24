const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        user_name: {type: String, required: true},
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
        isVendor: {type: Boolean, default: false},

        cccd: {
            type: String,
            required: false, // vendor update thêm cccd
        },

        access_token: {type: String},

        refresh_token: {type: String},

        wallet: {type: Number, default: 0},
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
