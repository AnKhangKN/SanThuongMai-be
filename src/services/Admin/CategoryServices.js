const Category = require("../../models/Category");

const getAllCategories = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const categories = await Category.find();

            resolve({
                status: "200",
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

const updateCategory = async ({
                                  categoryId,
                                  categoryName,
                                  description,
                                  vat,
                                  platformFee,
                                  typeFees,
                                  isActive,
                              }) => {
    try {
        const category = await Category.findByIdAndUpdate(
            categoryId,
            { categoryName, description, vat, platformFee, typeFees, isActive },
            { new: true }
        );

        if (!category) {
            throw {
                status: 404,
                message: "Không tìm thấy danh mục",
            };
        }

        return {
            status: 200,
            message: "Cập nhật danh mục thành công",
            data: category,
        };
    } catch (error) {
        throw {
            status: error.status || 500,
            message: error.message || "Lỗi máy chủ",
        };
    }
};


module.exports = {
    getAllCategories,
    createCategory,
    updateCategory
};