const ProductViewLog = require("../../models/TrainingAi/ProductViewLog");
const SearchKeyLog = require("../../models/TrainingAi/SearchKeyLog");

const addProductViewLog = async ({ userId, productId }) => {
  try {
    let query = { productId, action: "view" };

    query.userId = userId || null; // luôn thống nhất null cho guest

    const productViewLog = await ProductViewLog.findOneAndUpdate(
      query,
      {
        $inc: { count: 1 },
        $setOnInsert: { timestamp: new Date() },
      },
      { upsert: true, new: true }
    );

    return productViewLog;
  } catch (error) {
    throw error;
  }
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
  addSearchKeyLog,
};
