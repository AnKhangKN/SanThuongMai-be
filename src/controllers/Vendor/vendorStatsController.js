const vendorStatsService = require("../../services/Vendor/vendorStatsService");

const getStatistics = async (req, res) => {
  try {
    const vendorId = req.user?.id; // Lấy từ token
    if (!vendorId) {
      return res
        .status(401)
        .json({ success: false, message: "Token không hợp lệ" });
    }

    const data = await vendorStatsService.getStatistics(vendorId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Lỗi khi lấy thống kê:", error.message);

    if (error.message.includes("Vendor chưa có shop")) {
      return res.status(404).json({ success: false, message: error.message });
    }

    if (error.message.includes("Vendor không tồn tại")) {
      return res.status(404).json({ success: false, message: error.message });
    }

    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
};

module.exports = {
  getStatistics,
};
