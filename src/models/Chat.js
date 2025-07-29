const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    lastMessage: {
        text: { type: String },
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date },
    },
}, {
    timestamps: true,
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
