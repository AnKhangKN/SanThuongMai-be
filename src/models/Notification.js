const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
        recipient: { // Người nhận thông báo
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        type: {
            type: String,
            enum: [
                "order",      // cập nhật đơn hàng
                "message",    // chat, support
                "product",    // sản phẩm được duyệt / từ chối
                "system",     // thông báo hệ thống
                "promotion",  // voucher, chiến dịch
                "report",     // người dùng báo cáo
                "shop",       // shop được duyệt, bị cấm, ...
                "finance",    // thanh toán, nạp tiền
            ],
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        content: {
            type: String,
            required: true,
        },

        link: {
            type: String, // link các chương trình nếu có ( gửi cho user )
            required: false,
        },

        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;