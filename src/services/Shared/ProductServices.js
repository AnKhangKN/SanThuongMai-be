const Product = require("../../models/Product");
const Shop = require("../../models/Shop");

const getAllProducts = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allProducts = await Product.find()
                .populate({
                    path: "shopId",
                    select: "status", // Chỉ cần status, không cần shopId.status
                });

            // Lọc sản phẩm có status "active" và shop cũng "active"
            const activeProducts = allProducts.filter(
                (product) =>
                    product?.status === "active" &&
                    product.shopId?.status === "active"
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
                    path: "shopId",
                    select: "status",
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

const getDetailProduct = (productId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findById(productId);
            if (!product) return reject({ status: "ERROR", message: "Product not found" });

            const shop = await Shop.findById(product.shopId);
            const countProductShop = await Product.countDocuments({ shopId: product.shopId });

            resolve({
                status: "OK",
                product,
                shop,
                countProductShop,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const searchProducts = (keyword) => {
    return new Promise(async (resolve, reject) => {
        try {
            const allProducts = await Product.find({
                product_name: { $regex: keyword, $options: "i" }, // Tìm theo tên, không phân biệt hoa thường
            }).populate({
                path: "user_id",
                select: "shop.status",
            });

            // Lọc sản phẩm active và shop active
            const activeProducts = allProducts.filter(
                (product) =>
                    product?.status === "active" &&
                    product.user_id?.shop?.status === "active"
            );

            resolve({
                status: "OK",
                message: `Tìm thấy ${activeProducts.length} sản phẩm phù hợp.`,
                data: activeProducts,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getAllCategoriesHome = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // Lấy tất cả sản phẩm, bao gồm danh mục của mỗi sản phẩm
            const allProducts = await Product.find()
                .populate({
                    path: "shopId",
                    select: "status",
                });

            // Kiểm tra tình trạng sản phẩm (sản phẩm và shop phải ở trạng thái active)
            const activeProducts = allProducts.filter((product) =>
                product?.status === "active" &&
                product.user_id?.shop?.status === "active"
            );

            // Gộp sản phẩm theo danh mục
            const categories = {};

            activeProducts.forEach((product) => {
                const categoryName = product.category; // Danh mục của sản phẩm
                const productImage = product.images[0] || ''; // Lấy ảnh đầu tiên làm ảnh đại diện cho danh mục

                // Kiểm tra nếu danh mục đã tồn tại trong categories
                if (!categories[categoryName]) {
                    categories[categoryName] = {
                        name: categoryName,
                        image: productImage, // Sử dụng ảnh của sản phẩm làm ảnh danh mục
                        products: [],
                    };
                }

                // Thêm sản phẩm vào danh mục tương ứng
                categories[categoryName].products.push(product);
            });

            // Chuyển đối tượng categories thành mảng để trả về
            const categoriesArray = Object.values(categories);

            resolve({
                status: "OK",
                message: "Lấy danh sách sản phẩm theo danh mục thành công",
                data: categoriesArray,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const searchCategory = (keyword) => {
    return new Promise(async (resolve, reject) => {
        try {
            const allProducts = await Product.find({
                category: { $regex: keyword, $options: "i" }, // So khớp chính xác danh mục với từ khóa
            }).populate({
                path: "user_id",
                select: "shop.status",
            });

            // Lọc sản phẩm active và shop active
            const activeProducts = allProducts.filter(
                (product) =>
                    product?.status === "active" &&
                    product.user_id?.shop?.status === "active"
            );

            resolve({
                status: "OK",
                message: `Tìm thấy ${activeProducts.length} sản phẩm phù hợp.`,
                data: activeProducts,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getTopCartProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allProducts = await Product.find()
                .populate({
                    path: "shopId",
                    select: "status",
                });

            // Kiểm tra tình trạng sản phẩm (nếu sản phẩm đang active và trạng thái shop cũng active)
            const activeProducts = allProducts.filter((product) =>
                product?.status === "active" &&
                product.user_id?.shop?.status === "active"
            );

            // Sắp xếp theo sold_count giảm dần
            const sorted = activeProducts.sort((a, b) => b.sold_count - a.sold_count);

            // Lấy 12 sản phẩm bán chạy nhất
            const top12 = sorted.slice(0, 12);


            resolve({
                status: "OK",
                message: "Lấy danh sách sản phẩm thành công",
                data: top12,
            });
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    getAllProducts,
    getTopSearchProduct,
    getAllCategoriesHome,
    searchProducts,
    getDetailProduct,
    searchCategory,
    getTopCartProduct
};
