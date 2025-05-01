const ProductService = require("../../services/Vendor/ProductService");

const createProduct = async (req, res) => {
  try {
    const { product_name, description, category, images, details, user_id } =
      req.body;
    // Kiểm tra dữ liệu bắt buộc
    if (
      !product_name ||
      !category ||
      !images ||
      !Array.isArray(details) ||
      details.length === 0 ||
      !details[0].price ||
      !details[0].quantity
    ) {
      return res.status(401).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    const response = await ProductService.createProduct(req.body);
    console.log("response:", response);
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
    const productId = req.params.id;
    const data = req.body;

    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }

    const response = await ProductService.updateProduct(productId, data);
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
};
