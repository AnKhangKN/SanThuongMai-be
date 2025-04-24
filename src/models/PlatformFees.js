const mongoose = require("mongoose");

const platformFeesSchema = new mongoose.Schema({
    fee_type: {
        type: String,
        enum: ["percentage", "fixed"], // Chi phí cố định và chi phí phần trăm
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
    effective_from: {
        type: Date,
        default: Date.now,
    },
});

const PlatformFee = mongoose.model("PlatformFee", platformFeesSchema);
module.exports = PlatformFee;
