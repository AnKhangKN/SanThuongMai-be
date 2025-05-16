const User = require("../../models/User");
const Product = require("../../models/Product");
const Order = require("../../models/Order");

const getAllHome = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const countShop = await User.countDocuments({
                "shop.name": { $exists: true, $ne: null }
            });

            const countProduct = await Product.countDocuments({
                "product_name": { $exists: true, $ne: null }
            });

            const countOrder = await Order.countDocuments({
                "_id": { $exists: true, $ne: null }
            });


            const setData = {
                countShop,
                countProduct,
                countOrder
            };


            resolve({
                status: "success",
                message: "Lấy đủ thông tin!",
                data: setData
            });
        } catch (error) {
            console.error("Lỗi server:", error);
            reject({
                status: "error",
                message: "Lỗi server!",
                error: error.message
            });
        }
    });
};


module.exports = {
    getAllHome,
}