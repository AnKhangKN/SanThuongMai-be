const Product = require("../../models/Product");
const User = require("../../models/User");

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

const getDetailProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({ _id: id });

            const owner_id = product.user_id;

            const owner = await User.findOne({ _id: owner_id });

            const shop = owner?.shop;

            const countProductsOwner = await Product.countDocuments({
                user_id: owner_id
            });


            if (!product) {
                return reject(new Error("Không tìm thấy sản phẩm"));
            }

            resolve({
                status: "OK",
                data: {product, shop, countProductsOwner}
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
                    path: "user_id",
                    select: "shop.status",
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


module.exports = {
    getAllProducts,
    getTopSearchProduct,
    getAllCategoriesHome,
    searchProducts,
    getDetailProduct,
    searchCategory
};
