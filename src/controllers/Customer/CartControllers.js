const CartServices = require("../../services/Customer/CartServices");

const addToCart = async (req, res) => {
    try {
        const {
            productId,
            productName,
            productImage,
            attributes,
            price,
            quantity,
            shopId,
            shopName,
        } = req.body;

        const user_id = req.user?.id;
        
        if (!user_id) {
            return res.status(401).json({
                status: "ERROR",
                message: "Không xác định người dùng!",
            });
        }

        if (!productId || !shopId || !price || !quantity) {
            return res.status(400).json({
                status: "ERROR",
                message: "Thiếu thông tin bắt buộc!",
            });
        }

        const result = await CartServices.addToCart({
            user_id,
            items: [
                {
                    productId,
                    productName,
                    productImage,
                    attributes,
                    price,
                    quantity,
                    shopId,
                    shopName,
                },
            ],
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
            return res.status(400).json({
                status: "ERROR",
                message: "Không tìm thấy người dùng"
            });
        }

        const result = await CartServices.getAllItems(user_id); // Thêm await
        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
        });
    }
};

const updateCartQuantity = async (req, res) => {
    try {
        // Lấy user_id từ request (giả sử thông tin người dùng được lưu trong req.user)
        const user_id = req.user?.id;

        const data = req.body;

        if (!user_id) {
            return res.status(400).json({
                status: "ERROR",
                message: "Không phải người dùng!" // "Không phải người dùng hợp lệ"
            });
        }

        const result = await CartServices.updateCartQuantity(data);
        return res.status(200).json(result);

    } catch (error) {
        // Xử lý các lỗi phát sinh trong quá trình
        return res.status(500).json({
            status: "ERROR",
            message: error.message || "Lỗi máy chủ nội bộ", // "Lỗi máy chủ nội bộ"
        });
    }
};

const deleteCartItem = async (req, res) => {
    try {
        const user_id = req.user?.id;

        if (!user_id) {
            return res.status(401).json({
                status: "ERROR",
                message: "Bạn chưa đăng nhập hoặc không có quyền!",
            });
        }

        const data = req.body;

        const result = await CartServices.deleteCartItem(data);

        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json({
            status: "ERROR",
            message: e.message || "Lỗi server nội bộ",
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
            message: error.message || "Internal Server Error",
        })
    }
}

module.exports = {addToCart, getAllItems, updateCartQuantity, deleteCartItem, getProductBestSellersInCart};
