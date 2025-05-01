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

const getDetailProduct = async (req, res) => {
    try {

        const { id } = req.params;

        console.log('id', id);

        const product = await ProductServices.getDetailProduct(id)

        return res.status(200).json({
            status: "OK",
            data: product,
        });
    } catch (error) {
        return res.status(500).json({
            status: "ERR",
            message: error.message || "Lỗi máy chủ",
        });
    }
};

module.exports = {getAllProducts, getTopSearchProduct, getAllCategoriesHome, searchProducts, getDetailProduct }