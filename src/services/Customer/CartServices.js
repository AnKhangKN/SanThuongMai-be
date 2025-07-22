const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const addToCart = ({
                       user_id,
                       productId,
                       productName,
                       productImage,
                       attributes,
                       price,
                       salePrice,
                       finalPrice,
                       categoryId,
                       quantity,
                       shopId,
                       shopName,
                   }) => {
    return new Promise(async (resolve, reject) => {
        try {
            let cart = await Cart.findOne({userId: user_id});

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
                            salePrice,
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
                    salePrice,
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

            const allItem = await Cart.find({userId: user_id});

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
            const {cartId, productItemId, attributes, productId, quantity} = data;

            // Tìm sản phẩm trước
            const product = await Product.findOne({_id: productId});

            if (!product) {
                return reject({message: "Không tìm thấy sản phẩm"});
            }

            // Tìm đúng priceOption theo attributes
            const matchedOption = product.priceOptions.find(option => {
                return attributes.every(attr =>
                    option.attributes.some(optAttr =>
                        optAttr.name === attr.name && optAttr.value === attr.value
                    )
                );
            });

            if (!matchedOption) {
                return reject({message: "Không tìm thấy biến thể sản phẩm với thuộc tính tương ứng"});
            }

            // Kiểm tra tồn kho
            if (matchedOption.stock < quantity) {
                return reject({message: "Vượt quá số lượng tồn kho"});
            }

            // Cập nhật giỏ hàng
            const cart = await Cart.findOneAndUpdate(
                {
                    _id: cartId,
                    "productItems._id": productItemId,
                },
                {
                    $set: {
                        "productItems.$.quantity": quantity,
                    },
                },
                {new: true}
            );

            if (!cart) {
                return reject({
                    status: "ERROR",
                    message: "Không tìm thấy sản phẩm trong giỏ hàng.",
                });
            }

            return resolve({
                status: "OK",
                cart,
            });

        } catch (error) {
            return reject({
                status: "ERROR",
                message: "Đã xảy ra lỗi khi cập nhật giỏ hàng",
                error: error.message || error,
            });
        }
    });
};

const deleteCartItem = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const detailCartId = data.detailCartId;

            const deletedResult = await Cart.updateOne(
                {"productItems._id": detailCartId},
                {$pull: {productItems: {_id: detailCartId}}}
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
                .sort({sold_count: -1})
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
