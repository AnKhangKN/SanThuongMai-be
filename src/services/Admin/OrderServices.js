const Order = require("../../models/Order");
const User = require("../../models/User")
const Shop = require("../../models/Shop");

const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const orders = await Order.find().sort({ createdAt: -1 }); // sắp xếp mới nhất

            resolve({
                status: 200,
                message: "Lấy thành công danh sách order mới nhất",
                data: orders,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const setStatusOrder = (userId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const adminId = '6860059faead400715c4b4de';

            const {
                orderId,
                totalPriceItems,
                vendorGetPriceItems,
                amount,
                discountAmount,
                finalAmount,
                items: {
                    shopId,
                    shopName,
                    items
                }
            } = data;

            // 1. Tính phần trăm chiếm của đơn hàng này trong tổng amount (nếu có chia voucher toàn đơn)
            const percentDiscount = totalPriceItems / amount;
            const discountPriceOfOrder = percentDiscount * discountAmount;

            // 2. Tính tiền Admin nhận: chênh lệch giữa khách trả và Vendor nhận, sau khi trừ voucher
            const adminGetPriceAmount = totalPriceItems - vendorGetPriceItems - discountPriceOfOrder;

            // 3. Cộng tiền cho Admin
            const admin = await User.findByIdAndUpdate(
                adminId,
                { $inc: { wallet: adminGetPriceAmount } },
                { new: true }
            );

            // 4. Cộng tiền cho Vendor
            const shop = await Shop.findById(shopId);
            const vendorId = shop.ownerId;

            const vendor = await User.findByIdAndUpdate(
                vendorId,
                { $inc: { wallet: vendorGetPriceItems } },
                { new: true }
            );

            // 6. Cập nhật trạng thái trong Order nếu cần
            await Order.updateOne(
                { _id: orderId, 'productItems.shopId': shopId },
                {
                    $set: {
                        'productItems.$[elem].status': 'shipped',
                    }
                },
                {
                    arrayFilters: [{ 'elem.shopId': shopId }],
                    new: true
                }
            );

            resolve({
                status: 200,
                message: "Xử lý cập nhật trạng thái và ví tiền thành công",
                data: {
                    admin,
                    vendor
                }
            });

        } catch (error) {
            console.error("Lỗi setStatusOrder:", error);
            reject({
                status: 500,
                message: "Lỗi xử lý đơn hàng",
                error
            });
        }
    });
};


module.exports = {
    getAllOrder,
    setStatusOrder
};
