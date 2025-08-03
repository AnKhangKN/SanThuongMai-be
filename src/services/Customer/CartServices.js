const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const Category = require("../../models/Category");

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
            const product = await Product.findById(productId);
            if (!product) return reject(new Error("Không tìm thấy sản phẩm!"));

            const category = await Category.findById(categoryId);
            if (!category) return reject(new Error("Không tìm thấy danh mục sản phẩm!"));

            // Tìm đúng priceOption theo attributes
            const matchedOption = product.priceOptions.find(option => {
                const normalized = option.attributes.map(a => `${a.name}|${a.value}`);
                const required = attributes.map(a => `${a.name}|${a.value}`);
                return required.every(r => normalized.includes(r)) && normalized.length === required.length;
            });

            if (!matchedOption) return reject(new Error("Biến thể không hợp lệ cho sản phẩm này."));

            // Tính toán lại priceFee từ price và category.typeFees
            const platformFee = (category.platformFee) * price / 100;
            const vatFee = (category.vat) * price / 100;
            const priceFee = Math.round(price + platformFee + vatFee);

            let cart = await Cart.findOne({ userId: user_id });

            if (!cart) {
                if (matchedOption.stock < quantity)
                    return reject(new Error("Số lượng không đủ trong kho."));

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
                            priceFee,
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

            // Kiểm tra đã có sản phẩm đó chưa
            const existingIndex = cart.productItems.findIndex(
                item =>
                    item.productId.toString() === productId &&
                    JSON.stringify(item.attributes) === JSON.stringify(attributes)
            );

            let totalQuantity = quantity;

            if (existingIndex !== -1) {
                totalQuantity += cart.productItems[existingIndex].quantity;
            }

            if (matchedOption.stock < totalQuantity) {
                return reject(
                    new Error("Không đủ sản phẩm trong kho để thêm vào giỏ hàng.")
                );
            }

            if (existingIndex !== -1) {
                cart.productItems[existingIndex].quantity = totalQuantity;
            } else {
                cart.productItems.push({
                    productId,
                    productName,
                    productImage,
                    attributes,
                    price,
                    salePrice,
                    finalPrice,
                    priceFee,
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
            return reject(error);
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

            const cartId = data.cartId;
            const productItemId = data.productItemId;

            if (!cartId) {
                return reject({
                    messages: "Thiếu giỏ hàng!"
                })
            }


            const deletedResult = await Cart.updateOne(
                {"productItems._id": productItemId},
                {$pull: {productItems: {_id: productItemId}}}
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
