const Order = require("../../models/Order");

const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const orders = await Order.find().sort({ createdAt: -1 }); // sắp xếp mới nhất

            resolve({
                status: 200,
                message: "Lấy thành công danh sách order mới nhất",
                data: orders,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const setStatusOrder = (user_id, data) => {
    return new Promise(async (resolve, reject) => {
        try {

            const statusOrder = await Order.findByIdAndUpdate(
                data.Order_id,
                { $set: { status: "shipped" } },
                { new: true }
            );

            resolve({
                status: 200,
                message: "Đã chuyển cho bộ phận vận chuyển",
                data: statusOrder,
            });

        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    getAllOrder,
    setStatusOrder
};
