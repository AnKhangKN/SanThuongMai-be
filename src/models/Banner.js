import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
    programName: {
        type: String,
        required: true,
        trim: true,
    },

    images: {
        type: [String],
        default: [],
    },

    // Tùy chọn thời gian hiển thị
    startAt: { type: Date },
    endAt: { type: Date },

    // Trạng thái banner
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },

    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
        required: false,
    }

}, {
    timestamps: true,
});

const Banner = mongoose.model("Banner", bannerSchema);
module.exports = Banner;
