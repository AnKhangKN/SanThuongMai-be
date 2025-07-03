const mongoose = require("mongoose");

const attributeSchema = new mongoose.Schema({
    name: String,
    value: String,
}, { _id: false });

// Schema chi tiết từng sản phẩm trong đơn hàng
const productItemSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },

    productName: { type: String, required: true },

    productImage: { type: String, required: true },

    attributes: [attributeSchema],

    price: { type: Number, required: true, min: 0 },

    quantity: { type: Number, required: true, min: 0  },

    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true,
    },

    // Trạng thái riêng của từng sản phẩm
    status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "returned", "cancelled"],
        default: "pending",
        required: true,
    },

    isReviewed: {
        type: Boolean,
        default: false,
    },

    isDelivered: {
        type: Boolean,
        default: false,
    },

    deliveredAt: {
        type: Date,
    },

    // khi bị returned
    returnReason: { type: String },

    imgReturnReason: [{ type: String }],

    refundRequested: {
        type: Boolean,
        default: false
    },

    refundReason: {
        type: String,
        default: ""
    },

    // Lý do hủy đơn
    cancelReason: {
        type: String,
        default: ""
    }
}, { _id: false });

// Schema chính của đơn hàng
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    items: [productItemSchema], // Danh sách sản phẩm

    shippingAddress: {
        city: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true },
    },

    paymentMethod: {
        type: String,
        enum: ["COD", "Online", "Wallet"],
        default: "COD",
    },

    totalPrice: {
        type: Number,
        required: true,
    },

    note: {
        type: String,
        default: "",
    },

    isPaid: {
        type: Boolean,
        default: false,
    },

    paidAt: {
        type: Date,
    },

    isCancelled: {
        type: Boolean,
        default: false,
    },

    cancelledAt: {
        type: Date,
    },

    cancelReason: {
        type: String,
        default: "",  // hoặc required: false
    },

    // Trạng thái đơn hàng tổng
    orderStatus: {
        type: String,
        enum: ["pending", "completed", "cancelled"],
        default: "pending",
    }
}, {
    timestamps: true,
});


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
