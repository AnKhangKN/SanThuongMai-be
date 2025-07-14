const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],

    lastMessage: {
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, default: "" },
        createdAt: { type: Date }
    }
}, {
    timestamps: true,
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
