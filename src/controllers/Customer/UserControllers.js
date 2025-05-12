const UserServices = require("../../services/Customer/UserServices");
const ShopServices = require("./UserControllers");

const getDetailAccountUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        status: "err",
        message: "Không tìm thấy  người dùng",
      });
    }

    const result = await UserServices.getDetailAccountUser(userId);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: e.message || "Internal Server Error",
    });
  }
};

const updateAccountUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;

    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "Không có người dùng",
      });
    }

    // truyền vào
    const result = await UserServices.updateAccountUser(userId, data);

    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Internal Server Error",
    });
  }
};

const partialUpdateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;

    if (!userId || Object.keys(data).length === 0) {
      return res.status(400).json({
        message: "Thiếu thông tin cập nhật",
      });
    }

    const partialUpdate = await UserServices.partialUpdateUser(userId, data);

    return res.status(200).json(partialUpdate);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

// Add to Wishlist
const addWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = req.body;


    if (!userId) {
      return res.status(400).json({ status: "error", message: "Không thấy người dùng!" });
    }

    const result = await UserServices.addWishlist(userId, data);
    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message || "Internal Server Error" });
  }
};

module.exports = {
  getDetailAccountUser,
  updateAccountUser,
  partialUpdateUser,
  addWishlist,
};
