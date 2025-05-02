const CartServices = require("../../services/Customer/CartServices");

const addToCart = async (req, res) => {
    try {
        const user_id = req.user.id; // Lấy từ middleware
        const product_id = req.params.id;
        const item = req.body;

        const size = item.itemData.size
        const color = item.itemData.color;
        const price = item.itemData.price
        const quantity = item.quantity


        // Kiểm tra các trường bắt buộc
        if (!product_id || !price || !quantity) {
            return res.status(400).json({
                status: "ERROR",
                message: "Có thuộc tính trống!",
            });
        }

        // Gọi service
        const result = await CartServices.addToCart({
            user_id,
            item: {
                product_id,
                size,
                color,
                price,
                quantity
            }
        });

        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json({
            status: "ERROR",
            message: e.message || "Lỗi máy chủ!",
        });
    }
};

module.exports = { addToCart };
