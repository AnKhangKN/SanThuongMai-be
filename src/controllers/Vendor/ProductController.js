const ProductService = require("../../services/Vendor/ProductService");

const createProduct = async (req, res) => {
  try {
    const data = req.body;
    const files = req.files;

    // Lấy user_id từ token xác thực (trong middleware của bạn)
    const user_id = req.user?._id || req.user?.id;

    const response = await ProductService.createProduct(data, files, user_id);
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
