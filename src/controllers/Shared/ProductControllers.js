const ProductServices = require("../../services/Shared/ProductServices");

const getAllProducts = async (req, res) => {
    try {

        const result = await ProductServices.getAllProducts();
        console.log(result);
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

const getAllCategoriesHome = async (req, res) => {
    try {
        const result = await ProductServices.getAllCategoriesHome();

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
        });
    }
};

const searchProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword || ""; // Lấy từ query trên URL ?keyword=abc

        const result = await ProductServices.searchProducts(keyword);

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Đã xảy ra lỗi trong quá trình tìm kiếm.",
        });
    }
};


module.exports = {getAllProducts, getTopSearchProduct, getAllCategoriesHome, searchProducts}