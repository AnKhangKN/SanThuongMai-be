const ShopServices = require("../../services/admin/ShopServices");

const getAllShops = async (req, res) => {
    try {
        const result = await ShopServices.getAllShops();

        return res.status(200).json(result);  // Trả về kết quả danh sách cửa hàng
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
        });
    }
};

const partialUpdateShop = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = req.body;

        if (!userId) {
            return res.status(400).json({
                status: "ERROR",
                message: "Không có người dùng",
            });
        }

        // truyền vào
        const result = await ShopServices.partialUpdateShop(userId, data);

        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({
            message: err.message || "Internal Server Error",
        });
    }
};

module.exports = { getAllShops, partialUpdateShop };
