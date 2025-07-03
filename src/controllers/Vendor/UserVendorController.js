const UserVendorService = require("../../services/Vendor/UserVendorService");

const createVendor = async (req, res) => {
  try {
    const userId = req.params.id;

    // Kiểm tra userId bắt buộc
    if (!userId) {
      return res.status(401).json({
        status: "ERR",
        message: "The userId is required",
      });
    }

    const { cccd, shop } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!cccd) {
      return res.status(400).json({
        status: "ERR",
        message: "CCCD is required",
      });
    }

    if (
      !shop ||
      typeof shop !== "object" ||
      !shop.shopName ||
      !shop.phone ||
      !shop.address
    ) {
      return res.status(400).json({
        status: "ERR",
        message: "Shop info (shopName, phone, address) is required",
      });
    }

    const response = await UserVendorService.createVendor(userId, req.body);

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e?.message || "Internal server error",
    });
  }
};

module.exports = {
  createVendor,
};
