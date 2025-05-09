
const getDetailShop = (shop_id) => {
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

module.exports = {
    getDetailShop,
}