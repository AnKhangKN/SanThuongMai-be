const CartServices = require("../../services/Customer/CartServices");

const addToCart = async (req, res) => {
    try {
        const user_id = req.user?.id;
        if (!user_id) {
            return res.status(401).json({
                status: "ERROR",
                message: "Bạn chưa đăng nhập!",
            });
        }

        const {
            productId,
            productName,
            productImage,
            attributes,
            price,
            salePrice,
            finalPrice,
            categoryId,
            quantity,
            shopId,
            shopName,
        } = req.body;

        if (!productId || !shopId || !price || !quantity) {
            return res.status(400).json({
                status: "ERROR",
                message: "Thiếu thông tin sản phẩm bắt buộc!",
            });
        }

        const result = await CartServices.addToCart({
            user_id,
            productId,
            productName,
            productImage,
            attributes,
            price,
            salePrice,
            finalPrice,
            categoryId,
            quantity,
            shopId,
            shopName,
        });

        return res.status(200).json(result);
    } catch (e) {
        console.error("Lỗi addToCart:", e);
        return res.status(500).json({
            status: "ERROR",
            message: e.message || "Lỗi máy chủ!",
        });
    }
};

const getAllItems = async (req, res) => {
    try {
        const user_id = req.user?.id;
        if (!user_id) {
            return res.status(401).json({
                status: "ERROR",
                message: "Bạn chưa đăng nhập!",
            });
        }

        const result = await CartServices.getAllItems(user_id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            status: "ERROR",
            message: error.message || "Lỗi máy chủ!",
        });
    }
};

const updateCartQuantity = async (req, res) => {
    try {
        const user_id = req.user?.id;
        const { cartId, productItemId, attributes,productId, quantity } = req.body;



        if (!user_id) {
            return res.status(401).json({
                status: "ERROR",
                message: "Bạn chưa đăng nhập!",
            });
        }
        

        // Kiểm tra đầu vào
        if (!cartId || !productItemId || quantity < 1) {
            return res.status(400).json({
                status: "ERROR",
                message: "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",
            });
        }

        // Gọi service
        const result = await CartServices.updateCartQuantity({ cartId, productItemId,attributes,productId, quantity });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            status: "ERROR",
            message: error.message || "Lỗi máy chủ!",
        });
    }
};

const deleteCartItem = async (req, res) => {
    try {
        const user_id = req.user?.id;
        if (!user_id) {
            return res.status(401).json({
                status: "ERROR",
                message: "Bạn chưa đăng nhập!",
            });
        }

        const result = await CartServices.deleteCartItem(req.body);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            status: "ERROR",
            message: error.message || "Lỗi máy chủ!",
        });
    }
};

const getProductBestSellersInCart = async (req, res) => {
    try {
        const result = await CartServices.getProductBestSellersInCart();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            status: "ERROR",
            message: error.message || "Lỗi máy chủ!",
        });
    }
};

module.exports = {
    addToCart,
    getAllItems,
    updateCartQuantity,
    deleteCartItem,
    getProductBestSellersInCart,
};
