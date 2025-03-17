const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: [
        {
            type: String, // Lưu URL ảnh hoặc đường dẫn ảnh
            required: true,
        }
    ],
    category: {
        type: String,
        required: true,
    },


});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
