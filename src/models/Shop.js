const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true },
    isReported: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ["pending", "resolved", "dismissed"],
        default: "pending",
    },
});

const adminWarningSchema = new mongoose.Schema({
    message: { type: String },
    bannedUntil: { type: Date },
    isBanned: { type: Boolean, default: false },
    countBanned: { type: Number, default: 0 },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
}, { _id: false });

const shopSchema = new mongoose.Schema({
    shopName: { type: String, required: true, maxlength: 100 },

    description: { type: String, default: "", maxlength: 1000  },

    shopAvatar: { type: String, default: "" },

    city: { type: String, required: true },

    address: { type: String, required: true },

    phone: { type: String, required: true },

    state: { type: String, enum: ['active', 'pending', 'inactive'], default: 'pending' },

    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    followers: { type: Number, min: 0, default: 0 },

    // Tổng số sản phẩm đã bán thành công
    soldCount: { type: Number, default: 0 },

    adminWarnings: [adminWarningSchema],

    reports: [reportSchema],
}, {
    timestamps: true,
});

// Thêm index để tối ưu truy vấn
shopSchema.index({ state: 1 });

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
