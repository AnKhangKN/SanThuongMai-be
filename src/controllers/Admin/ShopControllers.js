const ShopServices = require("../../services/admin/ShopServices");

const getAllShops = async (req, res) => {
    try {
        const result = await ShopServices.getAllShops();

        return res.status(200).json(result);
    } catch (error) {
        console.error("→ Lỗi getAllShops:", error);
        return res.status(500).json({
            status: "ERROR",
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

        const result = await ShopServices.partialUpdateShop(userId, data);

        return res.status(200).json(result);
    } catch (err) {
        console.error("→ Lỗi partialUpdateShop:", err);
        return res.status(500).json({
            status: "ERROR",
            message: err.message || "Internal Server Error",
        });
    }
};

const getAllReportedShops = async (req, res) => {
    try {
        const result = await ShopServices.getAllReportedShops();

        return res.status(200).json(result);
    } catch (error) {
        console.error("→ Lỗi getAllReportedShops:", error);
        return res.status(500).json({
            status: "ERROR",
            message: error.message || "Internal Server Error",
        });
    }
};

const partialUpdateReportedShop = async (req, res) => {
    try {
        const shopId = req.params.id;
        const data = req.body;

        if (!shopId) {
            return res.status(400).json({
                status: "ERROR",
                message: "Không có người dùng",
            });
        }

        const result = await ShopServices.partialUpdateReportedShop(shopId, data);

        return res.status(200).json(result);
    } catch (err) {
        console.error("→ Lỗi partialUpdateReportedShop:", err);
        return res.status(500).json({
            status: "ERROR",
            message: err.message || "Internal Server Error",
        });
    }
};

module.exports = {
    getAllShops,
    partialUpdateShop,
    getAllReportedShops,
    partialUpdateReportedShop,
};
