const UserVendorService = require("../../services/Vendor/UserVendorService");

const createVendor = async (req, res) => {
  try {
    const { user_name, isVendor, cccd, shop, user_id } = req.body;
    const userId = req.params.id;
    // kiểm tra dữ liệu bắt buộc
    if (!userId) {
      return res.status(401).json({
        status: "ERR",
        message: "The userId is required",
      });
    }

    // Kiểm tra các trường bắt buộc trong vendor
    if (
      !cccd ||
      !shop ||
      typeof shop !== "object" ||
      !shop.name ||
      !shop.phone ||
      !shop.address
    ) {
      return res.status(400).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await UserVendorService.createVendor(userId, req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e || "Internal server error",
    });
  }
};

module.exports = {
  createVendor,
};
