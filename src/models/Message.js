// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },

    mediaUrl: { type: String },  // Hỗ trợ gửi ảnh

    isRead: {
        type: Boolean,
        default: false
    },

    isDeleted: { type: Boolean, default: false },

}, {
    timestamps: true,
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
