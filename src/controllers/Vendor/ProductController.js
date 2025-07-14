const ProductService = require("../../services/Vendor/ProductService");
const Shop = require("../../models/Shop");

const createProduct = async (req, res) => {
  try {
    const data = req.body;
    const files = req.files;
    const user_id = req.user?._id || req.user?.id;
    console.log("user _id", req.user._id);
    console.log("user id", req.user.id);

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
    const productId = req.body.id;
    const updatedData = req.body;

    if (!productId) {
      return res.status(400).json({
        status: "ERROR",
        message: "Thiếu productId",
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

module.exports = {
  createProduct,
  updateProduct,
  getAllProduct,
  updateStatusProduct,
};
