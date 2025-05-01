const Product = require("../../models/Product");
const getAllProducts = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // Populate để join dữ liệu từ bảng User
            const allProducts = await Product.find()

            resolve({
                status: "OK",
                message: "Lấy danh sách sản phẩm thành công",
                data: allProducts,
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports= {getAllProducts}