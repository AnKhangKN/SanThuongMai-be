const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['vendor', 'admin', 'customer'],
        default: 'customer',
    },
    phone: {
        type: String,
        required: true,
    },
    
    address: {
        type: String,
        required: true,
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
    },

})

const User = mongoose.model('User', userSchema);

module.exports = User;