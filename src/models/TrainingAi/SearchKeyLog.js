const mongoose = require("mongoose");

const SearchKeyLogSchema = new mongoose.Schema({
    keyword: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false, // nếu chưa đăng nhập
    },
    count: { type: Number, default: 1 },
    searchedAt: {
        type: Date,
        default: Date.now,
    },
});

const SearchKeyLog = mongoose.model("SearchKeyLog", SearchKeyLogSchema);
module.exports = SearchKeyLog;