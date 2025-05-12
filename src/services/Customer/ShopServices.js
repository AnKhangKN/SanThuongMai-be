const User = require("../../models/User");
const Products = require("../../models/Product");

const getShopDetails = async (shopId) => {
    try {
        const owner = await User.findById(shopId).lean();

        if (!owner) {
            throw new Error("Owner not found");
        }

        const owner_id = owner._id.toString();
        const products = await Products.find({ user_id: owner_id }).lean();
        const product_top = await Products.find({ user_id: owner_id })
            .lean()
            .sort({ sold_count: -1 }) // Sắp xếp theo số lượng bán giảm dần
            .limit(10);

        return {
            status: "success",
            message: "Lấy thành công!",
            data: {
                owner,
                products,
                product_top
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
