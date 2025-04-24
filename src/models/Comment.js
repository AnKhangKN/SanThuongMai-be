const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            maxlength: 500,
            required: true,
            trim: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            index: true,
        },
        // Admin khóa bình luận (nếu cần)
        status: {
            type: String,
            enum: ["approved", "rejected"],
            default: "approved",
        },
    },
    {
        timestamps: true,
    }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
