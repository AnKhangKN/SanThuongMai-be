const Product = require("../../models/Product");
const Shop = require("../../models/Shop");
const Category = require("../../models/Category")

const getAllProducts = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allProducts = await Product.find()
                .populate({
                    path: "shopId",
                    select: "status", // Chỉ lấy trạng thái của shop
                });

            const resultProducts = [];

            for (const product of allProducts) {
                const category = await Category.findById(product.categoryId).lean();

                // Chuyển sang plain object để thao tác
                const productObj = product.toObject();

                // Nếu có dữ liệu danh mục và price thì tính priceFee
                if (
                    category &&
                    Array.isArray(product.priceOptions?.price) &&
                    product.priceOptions.price.length > 0
                ) {
                    const basePrice = product.priceOptions.price[0];
                    const vat = category.vat || 0;
                    const platformFee = category.platformFee || 0;

                    const priceFee =
                        basePrice +
                        (basePrice * vat) / 100 +
                        (basePrice * platformFee) / 100;

                    productObj.priceFee = Math.round(priceFee);
                } else {
                    productObj.priceFee = null;
                }

                // Gắn thêm thông tin danh mục vào sản phẩm (trả về FE)
                if (category) {
                    productObj.categoryInfo = {
                        _id: category._id,
                        categoryName: category.categoryName,
                        vat: category.vat,
                        platformFee: category.platformFee,
                        typeFees: category.typeFees,
                    };
                } else {
                    productObj.categoryInfo = null;
                }

                // Lọc chỉ sản phẩm active & shop active
                if (
                    productObj.status === "active" &&
                    productObj.shopId?.status === "active"
                ) {
                    resultProducts.push(productObj);
                }
            }

            resolve({
                status: "OK",
                message: "Lấy danh sách sản phẩm thành công",
                data: resultProducts,
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

            const category = await Category.findById(product.categoryId)

            const shop = await Shop.findById(product.shopId);
            const countProductShop = await Product.countDocuments({ shopId: product.shopId });

            resolve({
                status: "OK",
                product,
                category,
                shop,
                countProductShop,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const searchProducts = async (keyword) => {
    try {
        // 1. Tìm tất cả sản phẩm có tên phù hợp
        const allProducts = await Product.find({
            productName: { $regex: keyword, $options: "i" },
            status: "active", // Chỉ lấy sản phẩm active
        });

        // 2. Lấy danh sách tất cả shop có status là active
        const activeShops = await Shop.find({ status: "active" }, "_id"); // chỉ lấy _id

        const activeShopIds = activeShops.map((shop) => shop._id.toString());

        // 3. Lọc ra các sản phẩm thuộc shop active
        const filteredProducts = allProducts.filter((product) =>
            activeShopIds.includes(product.shopId.toString())
        );

        return {
            status: "OK",
            message: `Tìm thấy ${filteredProducts.length} sản phẩm phù hợp.`,
            data: filteredProducts,
        };
    } catch (error) {
        console.error("searchProducts error:", error);
        return {
            status: "ERROR",
            message: "Đã xảy ra lỗi khi tìm kiếm sản phẩm.",
        };
    }
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
