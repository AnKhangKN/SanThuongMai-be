const Category = require("../../models/Category");

const getAllCategories = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const categories = await Category.find();

            // Không reject khi rỗng
            resolve({
                message: "All categories",
                data: categories,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const createCategory = ({categoryName, description, vat, platformFee, typeFees}) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!categoryName) {
                reject({
                    message: "Please enter a categoryName",
                })
            }

            const newCategory = await Category.create({
                categoryName, description, vat, platformFee, typeFees
            });

            resolve({
                message: "Tạo danh mục thành công",
                data: newCategory,
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    getAllCategories,
    createCategory
};