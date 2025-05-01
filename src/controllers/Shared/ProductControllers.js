const ProductServices = require("../../services/Shared/ProductServices");

const getAllProducts = async (req, res) => {
    try {
        const result = await ProductServices.getAllProducts();

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
        });
    }
};

const getTopSearchProduct = async (req, res) => {
    try {
        const result = await ProductServices.getTopSearchProduct();

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
        });
    }
};

module.exports = {getAllProducts, getTopSearchProduct}