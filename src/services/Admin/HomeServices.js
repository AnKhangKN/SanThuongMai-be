const Shop = require("../../models/Shop");
const Product = require("../../models/Product");

const getAllHome = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const countShop = await Shop.countDocuments();
            const countProduct = await Product.countDocuments();

            const setData = {
                countShop,
                countProduct,
            };

            resolve({
                status: "success",
                message: "Lấy đủ thông tin!",
                data: setData,
            });
        } catch (error) {
            console.error("Lỗi server:", error);
            reject({
                status: "error",
                message: "Lỗi server!",
                error: error.message,
            });
        }
    });
};

module.exports = {
    getAllHome,
};
