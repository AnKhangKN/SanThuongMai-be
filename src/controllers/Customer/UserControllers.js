const UserServices = require("../../services/Customer/UserServices");
const e = require("express");

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

const partialUpdateUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    const data = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "Không tìm thấy người dùng",
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
  partialUpdateUser,
  addWishlist,
};
