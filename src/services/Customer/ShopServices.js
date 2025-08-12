const Shop = require("../../models/Shop");
const Product = require("../../models/Product");
const User = require("../../models/User");

const getShopDetails = async (shopId) => {
  try {
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return {
        status: "error",
        message: "Không tìm thấy shop!",
        data: null,
      };
    }

    const products = await Product.find({ shopId: shopId, status: "active" });

    const productsTop = await Product.find({ shopId: shopId, status: "active" })
      .sort({ soldCount: -1 })
      .limit(10);

    const owner = await User.findOne({ _id: shop.ownerId });

    return {
      status: "success",
      message: "Lấy thành công!",
      data: {
        shop,
        products,
        productsTop,
        owner,
      },
    };
  } catch (error) {
    console.error("Error in getShopDetails:", error);
    throw new Error(error.message || "Failed to get shop details");
  }
};

module.exports = {
  getShopDetails,
};
