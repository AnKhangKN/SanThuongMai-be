const Product = require("../../models/Product");

const getAllProducts = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // Populate để join dữ liệu từ bảng User
            const allProducts = await Product.find().populate("user_id", "user_name email");

            console.log(allProducts);

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

const partialUpdateProduct = (productId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const partialUpdateProduct = await Product.findOneAndUpdate(
                { _id: productId },
                { $set: data },
                { new: true }
            );

            resolve({
                status: "OK",
                message: "Cập nhật sản phẩm thành công",  // Đổi thông điệp cho phù hợp
                data: partialUpdateProduct,
            });
        } catch (error) {
            console.error("→ Lỗi cập nhật:", error); // Log lỗi nếu có
            reject(error);
        }
    });
};


module.exports = { getAllProducts, partialUpdateProduct };
