const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    nameShop: {
        type: String,
        required: true,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'pending', 'inactive'],
        default: 'pending',
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    updateAt: {
        type: Date,
        default: Date.now,
    }
},
);

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;