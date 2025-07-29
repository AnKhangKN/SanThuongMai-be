const ProductViewLog = require("../../models/TrainingAi/ProductViewLog");
const SearchKeyLog = require("../../models/TrainingAi/SearchKeyLog");

const addProductViewLog = ({ userId, productId }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const logData = {
                productId,
                action: "view"
            };

            if (userId) {
                logData.userId = userId;
            }

            const productViewLog = await ProductViewLog.create(logData);
            resolve(productViewLog);
        } catch (error) {
            reject(error);
        }
    });
};

const addSearchKeyLog = async ({ userId, keyword }) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!keyword || keyword.trim().length === 0) {
                return resolve(null); // bỏ qua nếu keyword rỗng
            }

            const filter = { keyword: keyword.trim() };
            if (userId) {
                filter.userId = userId;
            }

            const existingLog = await SearchKeyLog.findOne(filter);

            if (existingLog) {
                existingLog.count += 1;
                existingLog.searchedAt = new Date(); // cập nhật thời gian tìm kiếm gần nhất
                await existingLog.save();
                return resolve(existingLog);
            }

            const newLog = await SearchKeyLog.create({
                keyword: keyword.trim(),
                userId,
            });

            resolve(newLog);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    addProductViewLog,
    addSearchKeyLog
};
