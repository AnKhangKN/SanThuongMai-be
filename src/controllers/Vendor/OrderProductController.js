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

const updateStatusOrder = async (req, res) => {
  try {
    const data = req.body;
    const userId = req.user.id;

    const response = await OrderProductService.updateStatusOrder(data, userId);
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
};
