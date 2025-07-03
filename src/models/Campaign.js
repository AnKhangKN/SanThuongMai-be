import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
    programName: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: "",
        trim: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    discountType: {
        type: String,
        enum: ['fixed', 'percent'],
        required: true,
    },
    discountValue: {
        type: Number,
        required: true,
    },

    // Cần chỉnh thêm
    // applicableScope: {
    //     type: String,
    //     enum: ['global', 'shop'],
    //     default: 'global', // toàn sàn
    // },
    // sponsor: {
    //     type: String,
    //     enum: ['admin', 'shop', 'shared'],
    //     default: 'admin', // admin chịu
    // },
    // status: {
    //     type: String,
    //     enum: ['active', 'inactive'],
    //     default: 'inactive',
    // },
}, { timestamps: true });

const Campaign = mongoose.model("Campaign", campaignSchema);
module.exports = Campaign;
