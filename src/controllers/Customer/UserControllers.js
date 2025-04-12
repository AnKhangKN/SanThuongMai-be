const UserServices = require("../../services/Customer/UserServices");

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

module.exports = {
  partialUpdateUser,
};
