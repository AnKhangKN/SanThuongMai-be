const Shop = require("../../models/Shop");

const getAllShops = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const shops = await Shop.find().populate("ownerId", "fullName email avatar");

            resolve({
                status: "OK",
                message: "Lấy danh sách cửa hàng thành công",
                shops,
            });
        } catch (error) {
            reject({
                status: "ERROR",
                message: "Đã xảy ra lỗi khi lấy danh sách cửa hàng",
                error,
            });
        }
    });
};

const activateShop = () => {
    return new Promise(async (resolve, reject) => {
        try {


        } catch (error) {
            return reject({
                message: error.message,
            })
        }
    })
}

module.exports = {
    getAllShops,
    activateShop
};
