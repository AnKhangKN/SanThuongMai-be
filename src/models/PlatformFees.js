const mongoose = require("mongoose");

const platformFeesSchema = new mongoose.Schema({
    fee_type: {
        type: String,
        enum: ["percentage", "fixed"],
        required: true,
    },
    fee_name: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    effective_from: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
}, {
    timestamps: true,
});

const PlatformFee = mongoose.model("PlatformFee", platformFeesSchema);

module.exports = PlatformFee;
