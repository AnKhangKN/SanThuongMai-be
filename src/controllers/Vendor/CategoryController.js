const CategoryService = require("../../services/Vendor/CategoryService");

const getAllCategory = async (req, res) => {
  try {

    const userId = req.user?.id;

    if (!userId) {
      return res.status(404).json({
        message: 'No user found'
      })
    }

    const categories = await CategoryService.getAllCategory();
    res.status(200).json({
      status: "OK",
      data: categories,
    });
  } catch (error) {
    console.error("Get Category Error:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Lấy danh sách category thất bại",
    });
  }
};

module.exports = {
  getAllCategory: getAllCategory,
};
