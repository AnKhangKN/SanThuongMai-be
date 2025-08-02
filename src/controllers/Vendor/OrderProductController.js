const OrderProductService = require("../../services/Vendor/OrderProductService");
const Shop = require("../../models/Shop");
const Order = require("../../models/Order");
const User = require("../../models/User");

const getAllOrderProducts = async (req, res) => {
  try {
    const userId = req.user?.id;

    const shop = await Shop.findOne({ ownerId: userId });
    if (!shop) {
      return res
        .status(404)
        .json({ status: "ERR", message: "Shop không tồn tại" });
    }

    const result = await OrderProductService.getOrderByVendor(shop._id);
    res.status(200).json(result);
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

const getBuyersInfo = async (req, res) => {
  try {
    const buyers = await OrderProductService.getBuyersInfoService();
    return res.status(200).json({
      status: "OK",
      data: buyers,
    });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách người mua:", err);
    return res.status(500).json({
      status: "ERR",
      message: "Lỗi server",
    });
  }
};

const updateStatusOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { newStatus } = req.body;

    const result = await OrderProductService.updateOrderProductItemsStatus(
      orderId,
      newStatus
    );

    return res.status(200).json({
      status: "OK",
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error);
    return res.status(500).json({
      status: "ERR",
      message: "Cập nhật trạng thái thất bại",
    });
  }
};

module.exports = {
  getAllOrderProducts,
  changeStatusOrder,
  getBuyersInfo,
  updateStatusOrder,
};
