const Order = require("../../models/Order");
const User = require("../../models/User");

const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const orders = await Order.find();

            const ordersWithDetails = await Promise.all(
                orders.map(async (order) => {
                    // Lấy thông tin người dùng đặt hàng
                    const user = await User.findOne({ _id: order.user_id });

                    // Duyệt qua từng sản phẩm và lấy thông tin chủ sở hữu
                    const itemsWithOwner = await Promise.all(
                        order.items.map(async (item) => {
                            const owner = await User.findOne({ _id: item.owner_id });

                            return {
                                ...item._doc,
                                owner: {
                                    owner_id: owner?._id,
                                    name: owner?.user_name || "Unknown",
                                    email: owner?.email || "Unknown",
                                },
                            };
                        })
                    );

                    return {
                        ...order._doc,
                        user: {
                            user_id: user?._id,
                            name: user?.user_name || "Unknown",
                            email: user?.email || "Unknown",
                        },
                        items: itemsWithOwner, // Đã đính kèm thông tin owner vào từng sản phẩm
                    };
                })
            );


            resolve({
                status: 200,
                message: "Lấy thành công danh sách order",
                data: ordersWithDetails,
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
