const ProductService = require("../../services/Vendor/ProductService");
const Shop = require("../../models/Shop");

const createProduct = async (req, res) => {
  try {
    const data = req.body;
    const files = req.files;
    const user_id = req.user?._id || req.user?.id;

    if (!data.productName || !data.category) {
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

    const productData = {
      ...data,
      images: imagePaths,
      shopId: shop._id, // ✅ Gán đúng shopId lấy từ DB
      priceOptions,
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
    const data = req.body;

    const response = await ProductService.updateProduct(data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal server error",
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const userId = req.user.id;

    const response = await ProductService.getAllProduct(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal server error",
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

module.exports = {
  createProduct,
  updateProduct,
  getAllProduct,
  updateStatusProduct,
};
