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

const getVendor = async (req, res) => {
  try {
    const vendorId = req.user.id; // từ token
    const shop = await UserVendorService.getVendorByUserId(vendorId);

    if (!shop) {
      return res.status(404).json({ message: "Không tìm thấy thông tin shop" });
    }

    res.status(200).json(shop);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const updateVendor = async (req, res) => {
  try {
    const userId = req.user.id; // lấy từ token
    const { shopName, phone, address, city, description } = req.body;

    if (!shopName || !phone || !address || !city) {
      return res.status(400).json({
        status: "ERR",
        message: "Vui lòng nhập đầy đủ các thông tin bắt buộc",
      });
    }

    const updatedShop = await UserVendorService.updateVendorByUserId(userId, {
      shopName,
      phone,
      address,
      city,
      description,
    });

    res.status(200).json({ status: "OK", data: updatedShop });
  } catch (error) {
    res.status(500).json({ status: "ERR", message: error.message });
  }
};

const updateAvatarVendor = async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ status: "ERR", message: "Vui lòng chọn ảnh" });
    }

    const updatedShop = await UserVendorService.updateAvatar(
      userId,
      file.filename
    );

    return res.status(200).json({ status: "OK", data: updatedShop });
  } catch (error) {
    return res.status(500).json({ status: "ERR", message: error.message });
  }
};

module.exports = {
  createVendor,
  getVendor,
  updateVendor,
  updateAvatarVendor,
};
