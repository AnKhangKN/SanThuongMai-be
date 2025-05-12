const ShopServices = require('../../services/Customer/ShopServices');

const getShopDetail = async (req, res) => {
    try {
        const { id: owner_id } = req.params;

        const shopDetail = await ShopServices.getShopDetails(owner_id);

        if (!shopDetail) {
            return res.status(404).json({
                status: "error",
                message: "Shop not found",
            });
        }

        return res.status(200).json({
            status: "success",
            data: shopDetail,
        });
    } catch (error) {
        console.error("Error in getShopDetail:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

module.exports = { getShopDetail };
