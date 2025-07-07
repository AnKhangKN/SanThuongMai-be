const express = require("express");
const router = express.Router();
const {verifyToken, isVendor} = require("../../middleware/authMiddleware");
const OrderProductController = require("../../controllers/Vendor/OrderProductController");
const Order = require("../../models/Order");

router.get(
  "/get-all-order",
    verifyToken,isVendor,
  OrderProductController.getAllOrderProducts
);

router.put(
  "/change-status",
    verifyToken,isVendor,
  OrderProductController.changeStatusOrder
);

// API đếm đơn hàng theo trạng thái cho vendor
router.get("/order-status", async (req, res) => {
  try {
    const { ownerId } = req.query;
    if (!ownerId)
      return res.status(400).json({ success: false, message: "Thiếu ownerId" });

    const result = await Order.aggregate([
      { $unwind: "$items" },
      {
        $match: {
          "items.owner_id": require("mongoose").Types.ObjectId(ownerId),
        },
      },
      {
        $group: {
          _id: "$items.status",
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = result.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error("Lỗi lấy thống kê:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

module.exports = router;
