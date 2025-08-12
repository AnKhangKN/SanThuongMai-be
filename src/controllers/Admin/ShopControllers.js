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

const activateShop = async (req, res) => {
    try {
        const { shopId, status } = req.body;
        

        const result = await ShopServices.activateShop({ shopId, status });
        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
        })
    }
}

module.exports = {
    getAllShops,
    activateShop
};
