const Shop = require("../../models/Shop");
const getAllShops = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const shops = await Shop.find;

            resolve({
                status: "OK",
                message: "Lấy danh sách cửa hàng thành công",
                data: shops,
            });
        } catch (error) {
            console.error("→ Lỗi khi lấy danh sách cửa hàng:", error);
            reject({
                status: "ERROR",
                message: "Đã xảy ra lỗi khi lấy danh sách cửa hàng",
                error,
            });
        }
    });
};


module.exports = {
    getAllShops,

};
