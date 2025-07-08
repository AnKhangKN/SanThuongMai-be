const Cart = require("../../models/Cart");
const User = require("../../models/User");
const Product = require("../../models/Product");
const Shop = require("../../models/Shop");

const addToCart = ({
                       user_id,
                       items: [
                           {
                               productId,
                               productName,
                               productImage,
                               attributes,
                               price,
                               quantity,
                               shopId,
                               shopName,
                           },
                       ],
                   }) => {
    return new Promise(async (resolve, reject) => {
        try {
            let cart = await Cart.findOne({ userId: user_id });

            // Nếu chưa có giỏ hàng, tạo mới
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

            // Kiểm tra xem sản phẩm đã có trong giỏ chưa (dựa trên productId + attributes)
            const existingIndex = cart.productItems.findIndex((item) => {
                return (
                    item.productId.toString() === productId &&
                    JSON.stringify(item.attributes) === JSON.stringify(attributes)
                );
            });

            if (existingIndex !== -1) {
                // Nếu đã có: tăng số lượng
                cart.productItems[existingIndex].quantity += quantity;
            } else {
                // Nếu chưa có: thêm mới
                cart.productItems.push({
                    productId,
                    productName,
                    productImage,
                    attributes,
                    price,
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
            console.error("Lỗi trong CartService.addToCart:", error);
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
                    message: "Người dùng không tồn tại"
                });
            }

            // Truy vấn các sản phẩm trong giỏ hàng của người dùng
            const allItem = await Cart.find({ userId: user_id });

            // Kiểm tra nếu giỏ hàng trống
            if (!allItem || allItem.length === 0) {
                return reject({
                    status: "ERROR",
                    message: "Giỏ hàng trống"
                });
            }

            // Trả về tất cả sản phẩm trong giỏ hàng
            resolve({
                status: "SUCCESS",
                data: allItem
            });

        } catch (error) {
            reject(error);
        }
    });
};

const updateCartQuantity = async (data) => {
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
                    message: "Không tìm thấy chi tiết sản phẩm khớp với kích thước và màu sắc.",
                });
            }

            // Kiểm tra tồn kho với số lượng yêu cầu (phải là số dương)
            if (newQuantity <= 0) {
                return reject({
                    status: "ERROR",
                    message: "Số lượng sản phẩm phải lớn hơn 0.",
                });
            }

            if (productDetail.quantity < newQuantity) {
                return reject({
                    status: "ERROR",
                    message: "Sản phẩm không còn đủ trong kho!",
                });
            }

            const updateQuantity = await Cart.findOneAndUpdate(
                { "items._id": detailCartId },
                { $set: { "items.$.quantity": newQuantity } },
                { new: true }
            );

            if (!updateQuantity) {
                return reject({
                    status: "ERROR",
                    message: "Không thể cập nhật số lượng sản phẩm trong giỏ hàng.",
                });
            }

            resolve({
                status: "OK",
                message: "Cập nhật số lượng sản phẩm thành công.",
                data: updateQuantity,
            });
        } catch (e) {
            reject({
                status: "ERROR",
                message: "Đã xảy ra lỗi trong quá trình cập nhật.",
                error: e.message || e,
            });
        }
    });
};

const deleteCartItem = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const detailCartId = data.detailCartId;

            const deletedResult = await Cart.updateOne(
                { "items._id": detailCartId }, // tìm giỏ có item cần xóa
                { $pull: { items: { _id: detailCartId } } } // xóa item khỏi mảng
            );

            resolve({
                status: "OK",
                message: "Đã xóa khỏi giỏ hàng!",
                data: deletedResult,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getProductBestSellersInCart = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const products = Product.find()
                .sort({ sold_count: -1 }) // Sắp xếp theo số lượng đã bán giảm dần
                .limit(12);

            resolve({
                status: "OK",
                message: "Lấy danh sách thành công",
                data: products,
            })

        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    addToCart,
    getAllItems,
    updateCartQuantity,
    deleteCartItem,
    getProductBestSellersInCart
};
