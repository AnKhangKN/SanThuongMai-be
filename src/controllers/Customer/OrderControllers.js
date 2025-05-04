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

const orderProduct = (req, res) => {
    try {

        const user_id = req.user?.id;

        // Nhận dữ liệu từ request body
        const {  shippingInfo, items, totalBill, paymentMethod } = req.body;

        // Kiểm tra nếu thiếu dữ liệu quan trọng
        if (!user_id || !shippingInfo || !items || !totalBill || items.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Thiếu thông tin cần thiết để tạo đơn hàng'
            });
        }

        // Gọi service orderProduct
        const result =  OrderServices.orderProduct(user_id, shippingInfo, items,totalBill, paymentMethod)

        return res.status(200).json(result);

    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e || "Internal Server Error",
        })
    }



};

module.exports = { getAllShippingCustomer, addShippingCustomer, orderProduct };