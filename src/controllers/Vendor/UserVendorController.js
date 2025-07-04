const UserVendorService = require("../../services/Vendor/UserVendorService");

const createVendor = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        status: "ERR",
        message: "Unauthorized: userId is missing",
      });
    }

    // Parse dữ liệu JSON từ multipart/form-data
    let parsedShop = {};
    try {
      parsedShop = JSON.parse(req.body.shop || "{}");
    } catch (err) {
      return res.status(400).json({
        status: "ERR",
        message: "Không thể parse thông tin shop",
      });
    }

    const { shopName, phone, address, city } = parsedShop;

    if (!shopName || !phone || !address || !city) {
      return res.status(400).json({
        status: "ERR",
        message:
          "Thông tin cửa hàng (shopName, phone, address, city) là bắt buộc",
      });
    }

    // Nếu có ảnh
    if (req.file?.filename) {
      console.log("Đã upload avatar:", req.file.filename);
      parsedShop.shopAvatar = req.file.filename;
    }

    parsedShop.ownerId = userId;
    parsedShop.state = "pending";

    const response = await UserVendorService.createVendor(userId, {
      shop: parsedShop,
    });

    return res.status(200).json(response);
  } catch (e) {
    console.error("Lỗi trong createVendor:", e);
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal server error",
    });
  }
};

module.exports = {
  createVendor,
};
