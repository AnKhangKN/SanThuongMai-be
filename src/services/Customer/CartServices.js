const Cart = require("../../models/Cart");
const User = require("../../models/User");
const Product = require("../../models/Product");

const addToCart = (newCart) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { user_id, items } = newCart;

            if (!Array.isArray(items) || items.length === 0) {
                return reject({
                    status: "ERROR",
                    message: "Danh sách sản phẩm không hợp lệ!",
                });
            }

            for (const [index, item] of items.entries()) {
                if (!item.owner_id) {
                    return reject({
                        status: "ERROR",
                        message: `Sản phẩm thứ ${index + 1} thiếu owner_id!`,
                    });
                }

                if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                    return reject({
                        status: "ERROR",
                        message: `Sản phẩm thứ ${index + 1} có số lượng không hợp lệ!`,
                    });
                }
            }

            const checkUser = await User.findById(user_id);
            if (!checkUser) {
                return reject({
                    status: "ERROR",
                    message: "Không tồn tại người dùng!",
                });
            }

            let cart = await Cart.findOne({ user_id });

            if (!cart) {
                cart = await Cart.create({
                    user_id,
                    items,
                });

                return resolve({
                    status: "OK",
                    message: "Tạo giỏ hàng và thêm sản phẩm thành công!",
                    data: cart,
                });
            }

            for (const newItem of items) {
                const {
                    product_id,
                    size,
                    color,
                    price,
                    quantity,
                    owner_id,
                    product_id_url,
                } = newItem;

                const product = await Product.findById(product_id_url);
                const shop = await User.findById(owner_id);

                console.log(product)

                const product_name = product ? product.product_name : '';
                const shop_name = shop && shop.shop ? shop.shop.name : '';

                const existingItem = cart.items.find(
                    (i) =>
                        i.product_id.toString() === product_id.toString() &&
                        i.size === size &&
                        i.color === color
                );

                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    cart.items.push({
                        product_id,
                        size,
                        color,
                        price,
                        quantity,
                        owner_id,
                        product_name,
                        shop_name,
                    });
                }
            }

            await cart.save();

            return resolve({
                status: "OK",
                message: "Đã cập nhật giỏ hàng!",
                data: cart,
            });
        } catch (error) {
            console.error("Lỗi hệ thống khi thêm vào giỏ hàng:", error);
            return reject({
                status: "ERROR",
                message: "Đã xảy ra lỗi hệ thống!",
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
            const allItem = await Cart.find({ user_id: user_id });

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
            const detailCartId = data.detailCartId;  // Id detail cart
            const newQuantity = data.quantity;

            const updateQuantity = await Cart.findOneAndUpdate(
                { "items._id": detailCartId },
                { $set: { "items.$.quantity": newQuantity } },
                { new: true }
            );

            resolve({
                status: "OK",
                message: "Cập nhật số lượng sản phẩm thành công.",
                data: updateQuantity,
            });
        } catch (e) {
            reject({
                status: "ERROR",
                message: "Đã xảy ra lỗi trong quá trình cập nhật.",
                error: e,
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

module.exports = { addToCart, getAllItems, updateCartQuantity, deleteCartItem };
