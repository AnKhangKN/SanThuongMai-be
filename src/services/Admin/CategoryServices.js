const Category = require("../../models/Category");

const getAllCategories = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const categories = await Category.find();
            if (!categories.length) {
                reject("Category not found");
            }

            resolve({
                message: "All Categories",
                categories
            });

        } catch (error) {
            reject(error);
        }
    })
}

const createCategory = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const category = await Category.create({

            })
            
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    getAllCategories,
    createCategory
};