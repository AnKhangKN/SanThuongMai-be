const mongoose = require('mongoose');

const ProductViewLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false, // nếu chưa đăng nhập
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    action: {
        type: String,
        enum: ['view', 'add_to_cart', 'wishlist', 'purchase'],
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const ProductViewLog = mongoose.model('ProductViewLog', ProductViewLogSchema);
module.exports = ProductViewLog;
