const mongoose = require('mongoose');

// Địa chỉ giao hàng
const shippingAddressSchema = new mongoose.Schema({
    phone: { type: String, required: false },
    city: { type: String, required: false,},
    address: { type: String, required: false,},
}, {
    _id: true,
});

// Sản phẩm yêu thích - cần giới hạn số sản phẩm yêu thích
const wishProductsSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    productName: { type: String, required: false, },
    images: { type: String }
}, {
    _id: false,
});

// Shop yêu thích - cần giới hạn số shop yêu thích
const wishShopsSchema = new mongoose.Schema({
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    shopName: { type: String,required: false, },
    images: { type: String, required: false, },
}, {
    _id: false,
});

// Người dùng
const userSchema = new mongoose.Schema({
    fullName: { type: String, default: "" },
    avatar: { type: String },

    email: { type: String, required: true, unique: true, index: true },
    // sẽ xử lý sau
    // isVerified: { type: Boolean, default: false },

    password: { type: String, required: true },

    shippingAddress: [shippingAddressSchema],

    wallet: { type: Number, default: 0, min: 0 },

    isAdmin: { type: Boolean, default: false },
    isVendor: { type: Boolean, default: false },

    accessToken: { type: String },
    refreshToken: { type: String },

    // Danh sách yêu thích
    wishProducts: [wishProductsSchema],
    wishShops: [wishShopsSchema],

}, {
    timestamps: true
});

userSchema.index({ isVendor: 1 });
userSchema.index({ isAdmin: 1 });


const User = mongoose.model('User', userSchema);

module.exports = User;
