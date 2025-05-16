const OrderProductService = require("../../services/Vendor/OrderProductService");

const getAllOrderProducts = async (req, res) => {
  try {
    const userId = req.user?.id;

    const response = await OrderProductService.getAllOrderProducts(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal server error",
    });
  }
};

const changeStatusOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { itemId } = req.body; // Lấy itemId từ body request

    if (!itemId) {
      return res.status(400).json({
        status: "ERR",
        message: "Missing itemId",
      });
    }

    // Giả sử service đã được sửa để nhận userId và itemId
    const response = await OrderProductService.changeStatusOrder(
      userId,
      itemId
    );

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal server error",
    });
  }
};

module.exports = {
  getAllOrderProducts,
  changeStatusOrder,
};
