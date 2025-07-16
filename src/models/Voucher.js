const mongoose = require("mongoose");

const VoucherSchema = new mongoose.Schema({
    voucherName: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        default: "",
    },

    category: { // danh mục vận chuyển, danh mục sản phẩm, danh mục đạt móc đơn hàng, ...
        type: String,
        required: true,
    },

    type: {
        type: String,
        enum: ['fixed', 'percentage'],
        required: true,
    },

    value: {
        type: Number,
        required: true,
        min: 0,
    },

    maxDiscount: {
        type: Number, // nếu type là percent (ví dụ như miễn phí vận chuyển là giảm 100% tiền vận chuyển)
    },

    minOrderValue: { // Đạt móc tiền sẽ được giảm
        type: Number,
        default: 0,
    },

    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },

    usageLimit: { // Số lượng voucher
        type: Number,
        required: true,
    },

    usedCount: { // Số lượng dùng
        type: Number,
        default: 0,
    },

    startDate: {
        type: Date,
        required: true,
    },

    endDate: {
        type: Date,
        required: true,
    },

    isActive: {
        type: Boolean,
        default: true,
    }

}, { timestamps: true });

const Voucher = mongoose.model("Voucher", VoucherSchema);
module.exports = Voucher;
