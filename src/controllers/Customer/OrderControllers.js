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

        const {phone, city, address} = req.body;

        if (!user_id) {
            return res.status(400).json({
                status: "ERROR",
                message: "Không tìm thấy người dùng!"
            });
        }

        const result = await OrderServices.addShippingCustomer(user_id, {phone, city, address});
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
        const userId = req.user?.id;

        // Nhận dữ liệu từ request body
        const {
            productItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            vouchers = [],
            discountAmount,
            finalAmount,
            shippingFee,
            shippingFeeByShop,
            noteItemsByShop
        } = req.body;
        

        const result = await OrderServices.orderProduct({
            userId,
            productItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            vouchers,
            discountAmount,
            finalAmount,
            shippingFee,
            shippingFeeByShop,
            noteItemsByShop // truyền xuống service
        });

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


        const productList = req.body.order.productItems
        const shippingByShopList = req.body.order.shippingByShop
        const voucherList = req.body.order.vouchers
        
        
        const result = await OrderServices.canceledOrder(user_id, {
            order,
            productList,
            shippingByShopList,
            voucherList,
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

const returnOrder = async (req, res) => {
    try {
        const userId = req.user?.id;

        const { order, refundReason } = req.body;

        const productList = req.body.order.productItems
        const shippingByShopList = req.body.order.shippingByShop
        const voucherList = req.body.order.vouchers
        

        const result = await OrderServices.returnOrder(userId, { order, productList, shippingByShopList, refundReason, voucherList })
        return res.status(200).json(result);

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
    removeShippingAddress,
    returnOrder
};