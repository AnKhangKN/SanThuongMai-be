const Product = require("../../models/Product");
const Shop = require("../../models/Shop");
const Category = require("../../models/Category");
const SearchKeyLog = require("../../models/TrainingAi/SearchKeyLog");
const ProductViewLog = require("../../models/TrainingAi/ProductViewLog");

const getAllProducts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allProducts = await Product.find().populate({
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

const getTopSearchProduct = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = { action: "view", productId: { $ne: null } };

      if (userId) {
        filter.userId = userId;
      } else {
        filter.userId = null;
      }

      const productViewLog = await ProductViewLog.find(filter)
        .sort({ count: -1 })
        .populate("productId")
        .lean();

      resolve(productViewLog);
    } catch (error) {
      reject(error);
    }
  });
};

const getDetailProduct = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findById(productId);
      if (!product)
        return reject({ status: "ERROR", message: "Product not found" });

      const category = await Category.findById(product.categoryId);

      const shop = await Shop.findById(product.shopId);
      const countProductShop = await Product.countDocuments({
        shopId: product.shopId,
      });

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

const getSuggestSearchKeyWord = async () => {
  try {
    const keywords = await SearchKeyLog.find().sort({ count: -1 }).limit(10); // chỉ lấy 10 từ khóa hot nhất

    return {
      message: "Danh sách các từ khóa hot nhất",
      keywords,
    };
  } catch (error) {
    throw error;
  }
};

const getAllCategoriesHome = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const categories = await Category.find();

      const categoriesWithImage = await Promise.all(
        categories.map(async (cat) => {
          const product = await Product.findOne({ categoryId: cat._id })
            .select("images")
            .lean();

          // Nếu không có sản phẩm, trả về null để lọc sau
          if (!product) return null;

          return {
            _id: cat._id,
            categoryName: cat.categoryName,
            description: cat.description,
            image: product.images?.[0] || null,
          };
        })
      );

      // Lọc bỏ các category không có sản phẩm
      const filteredCategories = categoriesWithImage.filter(Boolean);

      resolve(filteredCategories);
    } catch (error) {
      reject(error);
    }
  });
};

const searchCategory = (categoryId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm tất cả sản phẩm thuộc categoryId
      const products = await Product.find({ categoryId })
        .select("productName images priceOptions")
        .lean();

      resolve(products);
    } catch (error) {
      reject(error);
    }
  });
};

const getTopCartProduct = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allProducts = await Product.find().populate({
        path: "shopId",
        select: "status",
      });

      // Kiểm tra tình trạng sản phẩm (nếu sản phẩm đang active và trạng thái shop cũng active)
      const activeProducts = allProducts.filter(
        (product) =>
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
  });
};

module.exports = {
  getAllProducts,
  getTopSearchProduct,
  getAllCategoriesHome,
  searchProducts,
  getSuggestSearchKeyWord,
  getDetailProduct,
  searchCategory,
  getTopCartProduct,
};
