const ProductServices = require("../../services/Shared/ProductServices");

const getAllProducts = async (req, res) => {
  try {
    const result = await ProductServices.getAllProducts();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getDetailProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductServices.getDetailProduct(id);

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({
      status: "ERR",
      message: error.message || "Lỗi máy chủ",
    });
  }
};

const searchProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword || ""; // Lấy từ query trên URL ?keyword=abc

    const result = await ProductServices.searchProducts(keyword);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Đã xảy ra lỗi trong quá trình tìm kiếm.",
    });
  }
};

const getSuggestSearchKeyWord = async (req, res) => {
  try {
    const result = await ProductServices.getSuggestSearchKeyWord();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getTopSearchProduct = async (req, res) => {
  try {
    const userId = req.user?.id;

    const result = await ProductServices.getTopSearchProduct(userId);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getAllCategoriesHome = async (req, res) => {
  try {
    const result = await ProductServices.getAllCategoriesHome();

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const searchCategory = async (req, res) => {
  try {
    const categoryId = req.params?.categoryId;


    // Nếu không có từ khóa, trả về thông báo lỗi rõ ràng
    if (!categoryId) {
      return res.status(400).json({
        message: "Vui lòng chọn danh mục.",
      });
    }

    // Gọi hàm searchCategory từ ProductServices để tìm kiếm sản phẩm
    const result = await ProductServices.searchCategory(categoryId);

    // Trả về kết quả tìm kiếm thành công
    return res.status(200).json(result);
  } catch (error) {
    // Nếu có lỗi xảy ra trong quá trình tìm kiếm, trả về lỗi chi tiết
    console.error("Lỗi tìm kiếm danh mục:", error);
    return res.status(500).json({
      message: error.message || "Đã xảy ra lỗi trong quá trình tìm kiếm.",
    });
  }
};

const getTopCartProduct = async (req, res) => {
  try {
    const result = await ProductServices.getTopCartProduct();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
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
