const OrderServices = require("../../services/Customer/OrderServices")

const getAllShippingCustomer = async (req, res) => {
    try {
        const user_id = req.user?.id;

        if (!user_id) {
            return res.status(400).json({
                status: "ERROR",
                message: "Không tìm thấy người dùng"
            });
        }

        const result = await OrderServices.getAllShippingCustomer(user_id); // Thêm await
        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
        });
    }
};

const addShippingCustomer = async (req, res) => {
    try {
        const user_id = req.user?.id;

        const shippingInfo = req.body;

        if (!user_id) {
            return res.status(400).json({
                status: "ERROR",
                message: "Không tìm thấy người dùng!"
            });
        }

        const result = await OrderServices.addShippingCustomer(user_id, shippingInfo);
        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
        });
    }
};

const getAllOrderByStatus = async (req, res) => {
    try {
        const user_id = req.user?.id;

        if (!user_id) {
            return res.status(400).json({
                status: "ERROR",
                message: "Không tìm thấy người dùng"
            });
        }

        const keyword = req.query.keyword || "";

        const result = await OrderServices.getAllOrderByStatus(user_id, keyword);
        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({
            status: "ERROR",
            message: error.message || "Internal Server Error",
        });
    }
};

const orderProduct = async (req, res) => {
    try {
        const user_id = req.user?.id;

        // Nhận dữ liệu từ request body
        const { shippingInfo, items, totalBill, paymentMethod, orderNote } = req.body;

        // Kiểm tra nếu thiếu dữ liệu quan trọng
        if (!user_id || !shippingInfo || !items || !totalBill || items.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Thiếu thông tin cần thiết để tạo đơn hàng'
            });
        }

        // Gọi service orderProduct (Thêm await để đợi kết quả)
        const result = await OrderServices.orderProduct(
            user_id,
            shippingInfo,
            items,
            totalBill,
            paymentMethod,
            orderNote
        );

        return res.status(200).json(result);

    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message || "Internal Server Error",
        });
    }
};


const successfulDelivered = async (req, res) => {
    try {
        const user_id = req.user?.id;
        if (!user_id) {
            return res.status(400).json({
                status: "error",
                message: "Không tìm thấy người dùng"
            });
        }

        const { order, status } = req.body;

        if (!order || !order._id || !order.total_price || !Array.isArray(order.items) || !status) {
            return res.status(400).json({
                status: "error",
                message: "Dữ liệu đơn hàng không hợp lệ hoặc thiếu trạng thái"
            });
        }

        const result = await OrderServices.successfulDelivered(user_id, {
            order,
            status
        });

        return res.status(200).json(result);

    } catch (error) {

        return res.status(500).json({
            status: "error",
            message: error.message || "Lỗi máy chủ nội bộ"
        });
    }
};

const cancelOrder = async (req, res) => {
    try {

        const user_id = req.user?.id;
        if (!user_id) {
            return res.status(400).json({
                status: "error",
                message: "Không tìm thấy người dùng"
            })
        }

        const { order, status, cancelReason } = req.body;

        const result = await OrderServices.canceledOrder(user_id, {
            order,
            status,
            cancelReason
        });

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message || "Lỗi máy chủ nội bộ"
        });
    }
}

const removeShippingAddress = async (req, res) => {
    try {

        const user_id = req.user?.id;

        if (!user_id) {
            return res.status(400).json({
                status: "error",
                message: "Không tìm thấy người dùng"
            })
        }

        const shippingInfor = req.body;


        const data = OrderServices.removeShippingAddress(user_id, shippingInfor)

        return res.status(200).json(data);


    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
        })
    }
}

module.exports = {
    getAllShippingCustomer,
    addShippingCustomer,
    orderProduct,
    getAllOrderByStatus,
    successfulDelivered,
    cancelOrder,
    removeShippingAddress
};