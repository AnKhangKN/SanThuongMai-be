const Product = require("../../models/Product");

const getAllProducts = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allProducts = await Product.find()
                .populate({
                    path: "user_id",
                    select: "shop.status",
                });

            // Kiểm tra tình trạng sản phẩm nếu sản phẩm của shop ngoài active và sản phẩm đó ngoài active thì sẽ không được lấy
            const activeProducts = allProducts.filter((product) =>
                product?.status === "active" &&
                product.user_id?.shop?.status === "active"
            );

            resolve({
                status: "OK",
                message: "Lấy danh sách sản phẩm thành công",
                data: activeProducts,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getTopSearchProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allProducts = await Product.find()
                .populate({
                    path: "user_id",
                    select: "shop.status",
                });

            // Kiểm tra tình trạng sản phẩm (nếu sản phẩm đang active và trạng thái shop cũng active)
            const activeProducts = allProducts.filter((product) =>
                product?.status === "active" &&
                product.user_id?.shop?.status === "active"
            );

            // Sắp xếp theo sold_count giảm dần
            const sorted = activeProducts.sort((a, b) => b.sold_count - a.sold_count);

            // Lấy 10 sản phẩm bán chạy nhất
            const top10 = sorted.slice(0, 10);

            resolve({
                status: "OK",
                message: "Lấy danh sách sản phẩm thành công",
                data: top10,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getAllCategories = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allProducts = await Product.find()
                .populate({
                    path: "user_id",
                    select: "shop.status",
                });

            // Kiểm tra tình trạng sản phẩm (nếu sản phẩm đang active và trạng thái shop cũng active)
            const activeProducts = allProducts.filter((product) =>
                product?.status === "active" &&
                product.user_id?.shop?.status === "active"
            );

            // Sắp xếp theo sold_count giảm dần
            const sorted = activeProducts.sort((a, b) => b.sold_count - a.sold_count);

            // Lấy 40 sản phẩm bán chạy nhất
            const top10 = sorted.slice(0, 40);

            resolve({
                status: "OK",
                message: "Lấy danh sách sản phẩm thành công",
                data: top10,
            });
        } catch (error) {
            reject(error);
        }
    });
}
module.exports = { getAllProducts, getTopSearchProduct, getAllCategories };
