const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const addToCart = ({
                       user_id,
                       productId,
                       productName,
                       productImage,
                       attributes,
                       price,
                       finalPrice,
                       categoryId,
                       quantity,
                       shopId,
                       shopName,
                   }) => {
    return new Promise(async (resolve, reject) => {
        try {
            let cart = await Cart.findOne({ userId: user_id });

            // Nếu chưa có giỏ hàng → tạo mới
            if (!cart) {
                const newCart = await Cart.create({
                    userId: user_id,
                    productItems: [
                        {
                            productId,
                            productName,
                            productImage,
                            attributes,
                            price,
                            finalPrice,
                            categoryId,
                            quantity,
                            shopId,
                            shopName,
                        },
                    ],
                });

                return resolve({
                    status: "OK",
                    message: "Đã tạo giỏ hàng và thêm sản phẩm!",
                    cart: newCart,
                });
            }

            // Kiểm tra nếu sản phẩm đã có trong giỏ (dựa vào productId + attributes)
            const existingIndex = cart.productItems.findIndex(
                (item) =>
                    item.productId.toString() === productId &&
                    JSON.stringify(item.attributes) === JSON.stringify(attributes)
            );

            if (existingIndex !== -1) {
                // Đã có → tăng số lượng
                cart.productItems[existingIndex].quantity += quantity;
            } else {
                // Chưa có → thêm mới
                cart.productItems.push({
                    productId,
                    productName,
                    productImage,
                    attributes,
                    price,
                    finalPrice,
                    categoryId,
                    quantity,
                    shopId,
                    shopName,
                });
            }

            await cart.save();

            return resolve({
                status: "OK",
                message: "Thêm vào giỏ hàng thành công!",
                cart,
            });
        } catch (error) {
            console.error("Lỗi trong addToCart:", error);
            return reject({
                status: "ERROR",
                message: "Lỗi khi thêm vào giỏ hàng!",
            });
        }
    });
};

const getAllItems = (user_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!user_id) {
                return reject({
                    status: "ERROR",
                    message: "Người dùng không tồn tại",
                });
            }

            const allItem = await Cart.find({ userId: user_id });

            if (!allItem || allItem.length === 0) {
                return reject({
                    status: "ERROR",
                    message: "Giỏ hàng trống",
                });
            }

            resolve({
                status: "SUCCESS",
                data: allItem,
            });
        } catch (error) {
            reject({
                status: "ERROR",
                message: "Lỗi khi lấy giỏ hàng",
                error,
            });
        }
    });
};

const updateCartQuantity = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { detailCartId, quantity: newQuantity, product_id, size, color } = data;

            const product = await Product.findById(product_id);
            if (!product) {
                return reject({
                    status: "ERROR",
                    message: "Sản phẩm không tồn tại.",
                });
            }

            const productDetail = product.details.find(
                (detail) => detail.size === size && detail.color === color
            );

            if (!productDetail) {
                return reject({
                    status: "ERROR",
                    message: "Không tìm thấy chi tiết sản phẩm khớp với size và màu.",
                });
            }

            if (newQuantity <= 0) {
                return reject({
                    status: "ERROR",
                    message: "Số lượng phải lớn hơn 0.",
                });
            }

            if (productDetail.quantity < newQuantity) {
                return reject({
                    status: "ERROR",
                    message: "Không đủ hàng tồn kho.",
                });
            }

            const updatedCart = await Cart.findOneAndUpdate(
                { "productItems._id": detailCartId },
                { $set: { "productItems.$.quantity": newQuantity } },
                { new: true }
            );

            if (!updatedCart) {
                return reject({
                    status: "ERROR",
                    message: "Không thể cập nhật số lượng sản phẩm.",
                });
            }

            resolve({
                status: "OK",
                message: "Cập nhật số lượng thành công.",
                data: updatedCart,
            });
        } catch (e) {
            reject({
                status: "ERROR",
                message: "Đã xảy ra lỗi khi cập nhật.",
                error: e.message || e,
            });
        }
    });
};

const deleteCartItem = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const detailCartId = data.detailCartId;

            const deletedResult = await Cart.updateOne(
                { "productItems._id": detailCartId },
                { $pull: { productItems: { _id: detailCartId } } }
            );

            resolve({
                status: "OK",
                message: "Đã xóa sản phẩm khỏi giỏ hàng.",
                data: deletedResult,
            });
        } catch (error) {
            reject({
                status: "ERROR",
                message: "Lỗi khi xóa sản phẩm khỏi giỏ.",
                error,
            });
        }
    });
};

const getProductBestSellersInCart = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const products = await Product.find()
                .sort({ sold_count: -1 })
                .limit(12);

            resolve({
                status: "OK",
                message: "Lấy danh sách sản phẩm bán chạy thành công.",
                data: products,
            });
        } catch (error) {
            reject({
                status: "ERROR",
                message: "Lỗi khi lấy danh sách sản phẩm bán chạy.",
                error,
            });
        }
    });
};

module.exports = {
    addToCart,
    getAllItems,
    updateCartQuantity,
    deleteCartItem,
    getProductBestSellersInCart,
};
