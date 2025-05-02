const Cart = require("../../models/Cart");
const User = require("../../models/User");

const addToCart = (newCart) => {
    return new Promise(async (resolve, reject) => {
        const { user_id, item } = newCart;
        const { product_id, size, color, price, quantity } = item;

        try {
            const checkUser = await User.findById(user_id);
            if (!checkUser) {
                return reject({
                    status: "ERROR",
                    message: "Không tồn tại người dùng!",
                });
            }

            let cart = await Cart.findOne({ user_id });

            // Nếu chưa có giỏ hàng → tạo mới
            if (!cart) {
                cart = await Cart.create({
                    user_id,
                    items: [item],
                });

                return resolve({
                    status: "OK",
                    message: "Tạo giỏ hàng và thêm sản phẩm thành công!",
                    data: cart,
                });
            }

            // Tìm xem sản phẩm đã có trong items chưa
            const existingItem = cart.items.find(
                (i) =>
                    i.product_id.toString() === product_id &&
                    i.size === size &&
                    i.color === color
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push(item);
            }

            await cart.save();

            return resolve({
                status: "OK",
                message: "Đã cập nhật giỏ hàng!",
                data: cart,
            });
        } catch (err) {
            return reject({
                status: "ERROR",
                message: err.message || "Lỗi máy chủ!",
            });
        }
    });
};

module.exports = { addToCart };
