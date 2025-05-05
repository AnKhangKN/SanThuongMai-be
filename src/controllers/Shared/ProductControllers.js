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

const getDetailProduct = async (req, res) => {
    try {

        const { id } = req.params;

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

const searchCategory = async (req, res) => {
    try {
        // Lấy từ query trên URL ?keyword=abc, mặc định nếu không có sẽ là chuỗi rỗng
        const keyword = req.query.keyword || "";

        // Nếu không có từ khóa, trả về thông báo lỗi rõ ràng
        if (!keyword) {
            return res.status(400).json({
                message: "Vui lòng cung cấp từ khóa tìm kiếm danh mục.",
            });
        }

        // Gọi hàm searchCategory từ ProductServices để tìm kiếm sản phẩm
        const result = await ProductServices.searchCategory(keyword);

        // Nếu không tìm thấy sản phẩm nào, trả về thông báo
        if (result.data.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm nào với danh mục này.",
            });
        }

        // Trả về kết quả tìm kiếm thành công
        return res.status(200).json(result);
    } catch (error) {
        // Nếu có lỗi xảy ra trong quá trình tìm kiếm, trả về lỗi chi tiết
        console.error("Lỗi tìm kiếm danh mục:", error);
        return res.status(500).json({
            message: error.message || "Đã xảy ra lỗi trong quá trình tìm kiếm.",
        });
    }
};

module.exports = {
    getAllProducts,
    getTopSearchProduct,
    getAllCategoriesHome,
    searchProducts,
    getDetailProduct,
    searchCategory }