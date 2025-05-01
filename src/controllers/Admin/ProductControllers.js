const ProductServices = require("../../services/Admin/ProductServices");

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

const partialUpdateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const data = req.body;

        // Kiểm tra nếu productId không tồn tại
        if (!productId) {
            return res.status(400).json({
                status: "ERROR",
                message: "Không có mã sản phẩm",
            });
        }

        // Gọi service để cập nhật dữ liệu
        const result = await ProductServices.partialUpdateProduct(productId, data);

        return res.status(200).json({
            status: "OK",
            message: "Cập nhật sản phẩm thành công",
            data: result,
        });
    } catch (err) {
        return res.status(500).json({
            status: "ERROR",
            message: err.message || "Internal Server Error",
        });
    }
};

const getAllReportedProducts = async (req, res) => {
    try {
        const result = await ProductServices.getAllReportedProducts();

        return res.status(200).json(result);  // Trả về kết quả danh sách cửa hàng
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
        });
    }
};

module.exports = { getAllProducts,partialUpdateProduct, getAllReportedProducts };
