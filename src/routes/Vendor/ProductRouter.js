const express = require("express");
const router = express.Router();
const { isVendorMiddleware } = require("../../middleware/authMiddleware");
const uploadImgProducts = require("../../middleware/multerConfigProduct");
const ProductController = require("../../controllers/Vendor/ProductController");
const Product = require("../../models/Product");

router.post(
  "/add-product",
  isVendorMiddleware,
  uploadImgProducts,
  ProductController.createProduct
);

router.put(
  "/update-product",
  isVendorMiddleware,
  ProductController.updateProduct
);

router.get(
  "/get-all-product",
  isVendorMiddleware,
  ProductController.getAllProduct
);

// API tìm kiếm sản phẩm
router.get("/search-products", async (req, res) => {
  try {
    const { search } = req.query;

    if (!search || typeof search !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu từ khóa tìm kiếm hợp lệ" });
    }

    const products = await Product.find({
      product_name: { $regex: search, $options: "i" },
      status: "active",
    }).limit(10);

    res.status(200).json({ success: true, data: products });
  } catch (err) {
    console.error("Lỗi tìm kiếm sản phẩm:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

// API lọc sản phẩm theo khoảng giá
router.get("/filter-by-price", async (req, res) => {
  try {
    let { minPrice, maxPrice } = req.query;

    minPrice = minPrice !== undefined ? parseFloat(minPrice) : 0;
    maxPrice =
      maxPrice !== undefined ? parseFloat(maxPrice) : Number.MAX_SAFE_INTEGER;

    if (isNaN(minPrice) || isNaN(maxPrice)) {
      return res
        .status(400)
        .json({ success: false, message: "Giá không hợp lệ" });
    }

    if (minPrice > maxPrice) {
      return res.status(400).json({
        success: false,
        message: "Giá min phải nhỏ hơn hoặc bằng giá max",
      });
    }

    const products = await Product.aggregate([
      {
        $match: {
          status: "active",
          "details.price": { $gte: minPrice, $lte: maxPrice },
        },
      },
      {
        $project: {
          product_name: 1,
          status: 1,
          images: 1, // thêm trường hình ảnh
          category: 1, // thêm trường danh mục
          description: 1, // thêm trường mô tả
          details: {
            $filter: {
              input: "$details",
              as: "detail",
              cond: {
                $and: [
                  { $gte: ["$$detail.price", minPrice] },
                  { $lte: ["$$detail.price", maxPrice] },
                ],
              },
            },
          },
        },
      },
      { $limit: 20 },
    ]);

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Lỗi lọc sản phẩm theo giá:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

module.exports = router;
