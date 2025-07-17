const ProductService = require("../../services/Vendor/ProductService");
const Shop = require("../../models/Shop");
const Category = require("../../models/Category");

const createProduct = async (req, res) => {
  try {
    const data = req.body;
    const files = req.files;
    const user_id = req.user?._id || req.user?.id;

    if (!data.productName || !data.categoryId) {
      return res.status(400).json({
        status: "ERR",
        message: "Vui lòng cung cấp tên sản phẩm và danh mục.",
      });
    }

    const imagePaths = files?.map((file) => file.filename) || [];

    let priceOptions = [];
    if (data.priceOptions) {
      try {
        const parsed =
          typeof data.priceOptions === "string"
            ? JSON.parse(data.priceOptions)
            : data.priceOptions;

        priceOptions = parsed; // ✅ Không map lại, vì đã đúng format
      } catch (err) {
        return res.status(400).json({
          status: "ERR",
          message: "Dữ liệu biến thể không hợp lệ.",
        });
      }
    }

    // ❗️Lấy shopId của user hiện tại
    const shop = await Shop.findOne({ ownerId: user_id });

    if (!shop) {
      return res.status(400).json({
        status: "ERR",
        message: "Không tìm thấy cửa hàng tương ứng với người dùng.",
      });
    }

    // ❗️Lấy category để tính thuế/phí
    const category = await Category.findById(data.categoryId);
    if (!category) {
      return res.status(400).json({
        status: "ERR",
        message: "Danh mục không hợp lệ.",
      });
    }

    // ✅ Tính finalPrice cho mỗi option
    const updatedOptions = priceOptions.map((opt) => {
      const basePrice = opt.salePrice || opt.price;
      const finalPrice = Math.round(
        basePrice * (1 + (category.vat + category.platformFee) / 100)
      );

      return {
        ...opt,
        finalPrice,
      };
    });

    const productData = {
      ...data,
      images: imagePaths,
      shopId: shop._id,
      priceOptions: updatedOptions,
    };

    const response = await ProductService.createProduct(
      productData,
      files,
      user_id
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal server error",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.body.id;
    const updatedData = req.body;

    if (!productId || !updatedData.category) {
      return res.status(400).json({
        status: "ERROR",
        message: "Thiếu thông tin sản phẩm hoặc category",
      });
    }

    // Lấy thông tin thuế và platformFee từ category
    const category = await Category.findById(updatedData.category);
    if (!category) {
      return res.status(404).json({
        status: "ERROR",
        message: "Không tìm thấy danh mục sản phẩm",
      });
    }

    const VAT_PERCENT = category.vat ?? 0;
    const PLATFORM_FEE_PERCENT = category.platformFee ?? 0;

    // Xử lý từng biến thể
    if (updatedData.priceOptions && Array.isArray(updatedData.priceOptions)) {
      updatedData.priceOptions = updatedData.priceOptions.map((opt) => {
        const basePrice = opt.salePrice ?? opt.price ?? 0;
        const tax = basePrice * VAT_PERCENT;
        const platformFee = basePrice * PLATFORM_FEE_PERCENT;
        const finalPrice = basePrice + tax + platformFee;

        return {
          ...opt,
          tax,
          platformFee,
          finalPrice,
        };
      });
    }

    const result = await ProductService.updateProduct(productId, updatedData);

    res.status(200).json({
      status: "OK",
      message: "Cập nhật thành công",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Cập nhật thất bại",
      error: error.message,
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const vendorId = req.user.id;

    if (!vendorId) {
      return res.status(401).json({
        status: "ERR",
        message: "Unauthorized: vendorId is missing",
      });
    } else {
      const response = await ProductService.getAllProductByVendor(vendorId);
      return res.status(200).json(response);
    }
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Lỗi lấy ra sản phẩm",
    });
  }
};

const updateStatusProduct = async (req, res) => {
  try {
    const data = req.body;
    const userId = req.user.id;

    const response = await ProductService.updateStatusProduct(data, userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal server error",
    });
  }
};

const getSearchProduct = async (req, res) => {
  try {
    const vendorId = req.user.id; // từ verifyToken
    const keyword = req.query.keyword || "";

    if (!vendorId) {
      return res.status(401).json({
        status: "ERR",
        message: "Unauthorized: vendorId is missing",
      });
    }

    const products = await ProductService.searchProductsByName(
      vendorId,
      keyword
    );
    return res.status(200).json(products);
  } catch (err) {
    console.error("Search product error:", err);
    return res.status(500).json({ message: "Lỗi khi tìm kiếm sản phẩm." });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getAllProduct,
  updateStatusProduct,
  getSearchProduct,
};
