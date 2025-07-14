const Category = require("../../models/Category");

const getAllCategory = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const categories = await Category.find({ isActive: true });
      resolve({
        status: "OK",
        data: categories,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getAllCategory: getAllCategory,
};
