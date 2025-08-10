const User = require("../../models/User");
const Order = require("../../models/Order");
const Product = require("../../models/Product");
const Shop = require("../../models/Shop");
const Voucher = require("../../models/Voucher");
const Cart = require("../../models/Cart");
const mongoose = require("mongoose");

const getAllShippingCustomer = (user_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!user_id) {
                return reject({
                    status: 'error',
                    message: 'Please provide a user_id'
                });
            }

            // Tìm user theo _id
            const user = await User.findById(user_id).select('shippingAddress');

            if (!user) {
                return reject({
                    status: 'error',
                    message: 'Người dùng không tồn tại'
                });
            }

            resolve({
                status: 'success',
                message: 'Successfully fetched shipping addresses',
                data: user.shippingAddress // Trả ra mảng shipping_address
            });

        } catch (e) {
            reject({
                status: 'error',
                message: 'Server error',
                error: e.message
            });
        }
    });
};

const addShippingCustomer = (user_id, shippingAddress) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra xem user có tồn tại không
            const user = await User.findById(user_id);
            if (!user) {
                return reject({
                    status: 'error',
                    message: 'Người dùng không tồn tại'
                });
            }

            const {phone, city, address} = shippingAddress

            // Kiểm tra dữ liệu shippingInfo có đầy đủ không (bổ sung nhẹ nhàng)
            if (!phone || !address || !city) {
                return reject({
                    status: 'error',
                    message: 'Thiếu thông tin giao hàng'
                });
            }

            // Cập nhật địa chỉ giao hàng (thêm mới vào mảng)
            const updatedUser = await User.findByIdAndUpdate(
                user_id,
                {
                    $push: {
                        shippingAddress: {
                            phone,
                            address,
                            city,
                        }
                    }
                },
                { new: true }
            );

            resolve({
                status: 'SUCCESS',
                message: 'Đã thêm địa chỉ giao hàng thành công',
                data: updatedUser
            });

        } catch (error) {
            reject({
                status: 'error',
                message: 'Đã xảy ra lỗi khi thêm địa chỉ giao hàng',
                error: error.message
            });
        }
    });
};

const getAllOrderByStatus = (user_id, status) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra người dùng
            const user = await User.findById(user_id);
            if (!user) {
                return reject(new Error("Người dùng không tồn tại"));
            }

            const match = { userId: user_id };
            let statusList = [];

            // Xử lý các nhóm trạng thái đặc biệt
            if (status) {
                if (typeof status !== 'string' || !status.trim()) {
                    return reject(new Error("Status phải là chuỗi hợp lệ"));
                }

                const trimmedStatus = status.trim();

                switch (trimmedStatus) {
                    case "returnedOrCancelled":
                        statusList = ["returned", "cancelled"];
                        break;
                    case "shippingOrShipped":
                        statusList = ["shipping", "shipped"];
                        break;
                    default:
                        statusList = [trimmedStatus];
                        break;
                }

                match["productItems.status"] = { $in: statusList };
            }

            // Lấy đơn hàng có ít nhất 1 sản phẩm phù hợp, sắp xếp mới nhất
            const orders = await Order.find(match).sort({ createdAt: -1 });

            if (!orders.length) {
                return resolve({
                    status: "OK",
                    message: "Không có đơn hàng nào phù hợp",
                    data: []
                });
            }

            // Lọc sản phẩm theo trạng thái
            const filteredOrders = orders.map(order => {
                const filteredItems = order.productItems.filter(item =>
                    statusList.includes(item.status)
                );
                return {
                    ...order.toObject(),
                    productItems: filteredItems
                };
            }).filter(order => order.productItems.length > 0);

            return resolve({
                status: "OK",
                message: "Lấy đơn hàng thành công",
                data: filteredOrders
            });

        } catch (error) {
            console.error("Lỗi khi lấy đơn hàng:", error);
            reject({
                status: "ERROR",
                message: error.message || "Đã xảy ra lỗi không xác định",
            });
        }
    });
};

const orderProduct = ({
                          userId,
                          productItems,
                          shippingAddress,
                          paymentMethod,
                          totalPrice,
                          vouchers = [],
                          discountAmount,
                          finalAmount,
                          shippingFeeByShop,
                          noteItemsByShop
                      }) => {
    return new Promise(async (resolve, reject) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Tìm user
            const user = await User.findById(userId).session(session);
            if (!user) throw new Error("User not found");

            // Kiểm tra tồn kho, cập nhật soldCount shop + product, giảm stock
            for (const item of productItems) {
                const shop = await Shop.findById(item.shopId).session(session);
                if (!shop) throw new Error(`Shop not found for product: ${item.productName}`);

                shop.soldCount += item.quantity;
                await shop.save({ session });

                const product = await Product.findById(item.productId).session(session);
                if (!product) throw new Error(`Product not found: ${item.productName}`);

                const matchedOption = product.priceOptions.find((option) => {
                    if (option.attributes.length !== item.attributes.length) return false;
                    return item.attributes.every(attr =>
                        option.attributes.some(optAttr => optAttr.name === attr.name && optAttr.value === attr.value)
                    );
                });

                if (!matchedOption) {
                    throw new Error(`Không tìm thấy biến thể phù hợp cho sản phẩm: ${item.productName}`);
                }

                if (matchedOption.stock < item.quantity) {
                    throw new Error(`Sản phẩm "${item.productName}" không đủ tồn kho. Còn lại: ${matchedOption.stock}, bạn chọn: ${item.quantity}`);
                }

                matchedOption.stock -= item.quantity;
                product.soldCount += item.quantity;
                await product.save({ session });

                // Cập nhật giỏ hàng (xóa các item đã đặt)
                const cart = await Cart.findOne({ userId }).session(session);
                if (cart) {
                    cart.productItems = cart.productItems.filter(cartItem => {
                        return !productItems.some(orderItem =>
                            orderItem.productId.toString() === cartItem.productId.toString() &&
                            orderItem.shopId.toString() === cartItem.shopId.toString() &&
                            JSON.stringify(orderItem.attributes) === JSON.stringify(cartItem.attributes)
                        );
                    });
                    await cart.save({ session });
                }
            }

            // Giảm usageLimit voucher
            for (const voucher of vouchers) {
                const foundVoucher = await Voucher.findById(voucher.voucherId).session(session);
                if (foundVoucher) {
                    foundVoucher.usageLimit = Math.max(foundVoucher.usageLimit - 1, 0);
                    await foundVoucher.save({ session });
                }
            }

            // Gán trạng thái + note cho từng sản phẩm
            const productItemsWithStatus = productItems.map(item => ({
                ...item,
                status: paymentMethod === "Online" ? "processing" : "pending",
                noteItemsByShop: noteItemsByShop?.[item.shopId] || ""
            }));

            const calculateFinalShippingFeeByShop = (shippingFeeByShop, vouchers) => {
                // Lọc voucher giảm phí vận chuyển (category = 'van-chuyen')
                const shippingVouchers = vouchers.filter(v => v.category === 'van-chuyen');

                // Tính tổng phí ship ban đầu
                const totalShippingFee = Object.values(shippingFeeByShop).reduce((sum, fee) => sum + fee, 0);

                // Tính tổng phí ship sau khi áp voucher (cộng dồn từng voucher)
                let discountedTotalFee = totalShippingFee;

                for (const voucher of shippingVouchers) {
                    if (voucher.type === 'fixed') {
                        discountedTotalFee = Math.max(discountedTotalFee - voucher.value, 0);
                    } else if (voucher.type === 'percentage') {
                        discountedTotalFee = Math.max(discountedTotalFee * (1 - voucher.value / 100), 0);
                    }
                }

                discountedTotalFee = Math.round(discountedTotalFee);

                // Phân bổ lại phí ship theo tỉ lệ từng shop trong tổng phí ban đầu
                const result = [];
                for (const [shopId, shippingFee] of Object.entries(shippingFeeByShop)) {
                    const ratio = shippingFee / totalShippingFee || 0; // tránh chia 0
                    const finalFee = Math.round(discountedTotalFee * ratio);

                    result.push({
                        shopId: shopId,
                        shippingFee,        // phí ship gốc
                        shippingFeeFinal: finalFee,  // phí ship sau giảm
                    });
                }

                // Đảm bảo tổng finalFee không lệch (do làm tròn có thể sai số)
                // Tính tổng phí final tạm tính
                const sumFinalFee = result.reduce((sum, item) => sum + item.shippingFeeFinal, 0);
                const diff = discountedTotalFee - sumFinalFee;

                // Bù chênh lệch cho shop đầu tiên (nếu có)
                if (diff !== 0 && result.length > 0) {
                    result[0].shippingFeeFinal += diff;
                }

                return result;
            };

            // Tính phí ship theo từng shop sau giảm voucher
            const shippingByShopArray = calculateFinalShippingFeeByShop(shippingFeeByShop, vouchers);

            // Tạo đơn hàng
            const order = await Order.create([{
                userId,
                productItems: productItemsWithStatus,
                shippingAddress,
                paymentMethod,
                totalPrice,
                vouchers,
                discountAmount,
                finalAmount,
                shippingByShop: shippingByShopArray,
                isPaid: paymentMethod === "Online",
                paidAt: paymentMethod === "Online" ? new Date() : null
            }], { session });

            await session.commitTransaction();
            session.endSession();

            resolve({
                message: "Tạo đơn hàng thành công",
                order: order[0]
            });

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            reject({ message: error.message });
        }
    });
};

const successfulDelivered = async (user_id,{order, status}) => {
    try {
        // Kiểm tra nếu thiếu thông tin quan trọng
        if (!order || !status) {
            throw new Error("Thiếu thông tin!")
        }

        const totalBill = order.total_price;
        const items = order.items;
        const order_id = order._id;

        // Kiểm tra nếu order items không phải là mảng
        if (!Array.isArray(items) || items.length === 0) {
            throw new Error("Danh sách sản phẩm không hợp lệ");

        }

        // Lấy phí nền tảng
        const fee = await PlatformFees.findOne({ fee_name: "order" });
        if (!fee) {
            throw new Error("Không có chi phí nền tảng");
        }

        const fee_type = fee.fee_type;
        const value = fee.value;
        const fee_value = value / 100;

        // Tính phí nền tảng
        let fee_price;
        if (fee_type === "percentage") {
            fee_price = fee_value * totalBill;
        } else {
            fee_price = 20000;  // Phí cố định
        }

        // Tính các khoản chi phí khác
        const taxRate = parseFloat(process.env.TAX_FEE) || 0.05; // 5% thuế
        const tax_price = totalBill * taxRate;
        const shipping_price = parseFloat(process.env.SHIPPING_FEE) || 30000; // phí ship mặc định

        // Tính lợi nhuận của admin và tổng phần còn lại cho vendor
        const admin_profit = fee_price;
        const vendor_profit = totalBill - admin_profit - tax_price - shipping_price;

        // Gom theo từng vendor và tổng tiền hàng của họ
        const vendorMap = {};
        let totalItemAmount = 0;

        for (const item of items) {
            const amount = item.price * item.quantity;
            if (!vendorMap[item.owner_id]) {
                vendorMap[item.owner_id] = 0;
            }
            vendorMap[item.owner_id] += amount;
            totalItemAmount += amount;
        }

        // Tính toán số tiền thực nhận của từng vendor và cập nhật ví
        const updates = [];

        for (const [vendorId, vendorAmount] of Object.entries(vendorMap)) {
            const vendorRate = vendorAmount / totalItemAmount;
            const vendorNet = vendorRate * vendor_profit;

            updates.push(
                User.findByIdAndUpdate(vendorId, {
                    $inc: {
                        wallet: vendorNet,
                        "shop.total_order": 1 // Tăng total_order lên 1
                    }
                })
            );
        }

        // Cập nhật ví admin
        const adminId = process.env.ADMIN_ID;
        updates.push(
            User.findByIdAndUpdate(adminId, {
                $inc: { wallet: admin_profit }
            })
        );

        await Promise.all(updates);

        // Cập nhật trạng thái đơn hàng
        const successDelivered = await Order.findByIdAndUpdate(order_id, {
            status: status,
        }, { new: true });

        return {
            status: "success",
            message: "Thành công",
            data: successDelivered
        };

    } catch (error) {
        return {
            status: "error",
            message: error.message || "Lỗi không xác định"
        };
    }
}

const canceledOrder = async (user_id, { order, productList, shippingByShopList, cancelReason, voucherList }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const paymentMethod = order.paymentMethod;

            const orderBill = await Order.findById(order._id);
            if (!orderBill) {
                return reject({ message: "Không tìm thấy đơn hàng" });
            }

            const shopIdsToCancel = [...new Set(productList.map(p => p.shopId.toString()))];
            if (shopIdsToCancel.length > 1) {
                return reject({ message: "Chỉ được hủy sản phẩm của 1 shop mỗi lần" });
            }
            const shopId = shopIdsToCancel[0];

            const itemsToCancel = orderBill.productItems.filter(
                item => item.shopId.toString() === shopId
            );
            if (itemsToCancel.length === 0) {
                return reject({ message: "Không có sản phẩm nào để hủy" });
            }

            const invalidItem = itemsToCancel.some(
                item => !(item.status === "pending" || item.status === "processing")
            );
            if (invalidItem) {
                return reject({ message: "Một số sản phẩm đã xử lý, không thể hủy" });
            }

            orderBill.productItems.forEach(item => {
                if (item.shopId.toString() === shopId) {
                    item.status = "cancelled";
                    item.cancelReason = cancelReason;
                    item.canceledAt = new Date();
                }
            });

            const allCancelled = orderBill.productItems.every(i => i.status === "cancelled");
            if (allCancelled) {
                orderBill.orderStatus = "cancelled";
                orderBill.isCancelled = true;
            }

            await orderBill.save();

            if (paymentMethod === "Online" || paymentMethod === "Wallet") {
                const user = await User.findById(order.userId);
                if (!user) {
                    return reject({ message: "Không tồn tại khách hàng này" });
                }

                const totalProductPriceAll = orderBill.productItems.reduce(
                    (sum, item) => sum + item.finalPrice * item.quantity,
                    0
                );

                const totalShippingFeeAll = shippingByShopList.reduce(
                    (sum, s) => sum + (s.shippingFeeFinal || 0),
                    0
                );

                const totalProductPriceShop = itemsToCancel.reduce(
                    (sum, item) => sum + item.finalPrice * item.quantity,
                    0
                );

                const shopShipping = shippingByShopList.find(s => s.shopId.toString() === shopId);
                const shippingFeeShop = shopShipping ? shopShipping.shippingFeeFinal || 0 : 0;

                // Tính tổng voucher giảm phí vận chuyển (tất cả voucher category 'van-chuyen')
                const totalVoucherDiscountOnShipping = voucherList
                    .filter(v => v.category === "van-chuyen" && typeof v.discountAmount === "number")
                    .reduce((sum, v) => sum + v.discountAmount, 0);

                // Tính tổng voucher giảm giá sản phẩm / đơn hàng (category != 'van-chuyen')
                const totalVoucherDiscountOnProducts = voucherList
                    .filter(v => v.category !== "van-chuyen" && typeof v.discountAmount === "number")
                    .reduce((sum, v) => sum + v.discountAmount, 0);

                const ratioProduct = totalProductPriceAll > 0 ? totalProductPriceShop / totalProductPriceAll : 0;
                const ratioShipping = totalShippingFeeAll > 0 ? shippingFeeShop / totalShippingFeeAll : 0;

                const voucherDiscountOnProducts = totalVoucherDiscountOnProducts * ratioProduct;
                const voucherDiscountOnShipping = totalVoucherDiscountOnShipping * ratioShipping;

                const amountPaid =
                    typeof orderBill.finalAmount === "number" && orderBill.finalAmount > 0
                        ? orderBill.finalAmount
                        : orderBill.totalPrice - (totalVoucherDiscountOnProducts + totalVoucherDiscountOnShipping);

                const refundAmount = amountPaid * ratioProduct + shippingFeeShop - voucherDiscountOnShipping;

                user.wallet += refundAmount;
                await user.save();
            }

            resolve({
                message: "Đã hủy sản phẩm của shop thành công",
                order: orderBill,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const removeShippingAddress = (user_id, shippingAddress) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findByIdAndUpdate(
                user_id,
                {
                    $pull: { shippingAddress: { _id: shippingAddress.idAddress } }
                },
                { new: true } // để trả về dữ liệu mới sau khi update
            );

            if (!user) {
                return reject({ message: "User not found" });
            }
            

            resolve({
                message: "Address removed successfully",
                shippingAddresses: user.shippingAddresses
            });

        } catch (error) {
            reject(error);
        }
    });
};

const returnOrder = async (user_id, { order, productList, shippingByShopList, refundReason, voucherList = [] }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const orderBill = await Order.findById(order._id);
            if (!orderBill) {
                return reject({ message: "Không tìm thấy đơn hàng" });
            }

            const shopIdsToReturn = [...new Set(productList.map(p => p.shopId.toString()))];
            if (shopIdsToReturn.length > 1) {
                return reject({ message: "Chỉ được hoàn trả sản phẩm của 1 shop mỗi lần" });
            }
            const shopId = shopIdsToReturn[0];

            const itemsToReturn = orderBill.productItems.filter(
                item => item.shopId.toString() === shopId
            );
            if (itemsToReturn.length === 0) {
                return reject({ message: "Không có sản phẩm nào để hoàn trả" });
            }

            // Kiểm tra trạng thái hợp lệ để hoàn trả
            const invalidItem = itemsToReturn.some(
                item => !(item.status === "shipped" || item.status === "delivered")
            );
            if (invalidItem) {
                return reject({ message: "Một số sản phẩm đã xử lý, không thể hoàn trả" });
            }

            // Cập nhật trạng thái sản phẩm shop thành returned
            orderBill.productItems.forEach(item => {
                if (item.shopId.toString() === shopId) {
                    item.status = "returned";
                    item.refundRequested = true;
                    item.refundHandled = true;
                    item.refundReason = refundReason;
                    item.returnedAt = new Date();
                }
            });

            // Nếu tất cả sản phẩm đều returned thì update trạng thái đơn
            // const allReturned = orderBill.productItems.every(i => i.status === "returned");
            // if (allReturned) {
            //     orderBill.orderStatus = "returned";
            //     orderBill.isReturned = true;
            // }

            await orderBill.save();

            // Hoàn tiền cho user luôn không phân biệt phương thức thanh toán
            const user = await User.findById(order.userId);
            if (!user) {
                return reject({ message: "Không tồn tại khách hàng này" });
            }

            const totalProductPriceAll = orderBill.productItems.reduce(
                (sum, item) => sum + item.finalPrice * item.quantity,
                0
            );

            const totalShippingFeeAll = shippingByShopList.reduce(
                (sum, s) => sum + (s.shippingFeeFinal || 0),
                0
            );

            const totalProductPriceShop = itemsToReturn.reduce(
                (sum, item) => sum + item.finalPrice * item.quantity,
                0
            );

            const shopShipping = shippingByShopList.find(s => s.shopId.toString() === shopId);
            const shippingFeeShop = shopShipping ? shopShipping.shippingFeeFinal || 0 : 0;

            // Voucher giảm phí vận chuyển (category 'van-chuyen')
            const totalVoucherDiscountOnShipping = voucherList
                .filter(v => v.category === "van-chuyen" && typeof v.discountAmount === "number")
                .reduce((sum, v) => sum + v.discountAmount, 0);

            // Voucher giảm giá sản phẩm/đơn hàng (category != 'van-chuyen')
            const totalVoucherDiscountOnProducts = voucherList
                .filter(v => v.category !== "van-chuyen" && typeof v.discountAmount === "number")
                .reduce((sum, v) => sum + v.discountAmount, 0);

            const ratioProduct = totalProductPriceAll > 0 ? totalProductPriceShop / totalProductPriceAll : 0;
            const ratioShipping = totalShippingFeeAll > 0 ? shippingFeeShop / totalShippingFeeAll : 0;

            const voucherDiscountOnProducts = totalVoucherDiscountOnProducts * ratioProduct;
            const voucherDiscountOnShipping = totalVoucherDiscountOnShipping * ratioShipping;

            const amountPaid =
                typeof orderBill.finalAmount === "number" && orderBill.finalAmount > 0
                    ? orderBill.finalAmount
                    : orderBill.totalPrice - (totalVoucherDiscountOnProducts + totalVoucherDiscountOnShipping);

            const refundAmount = amountPaid * ratioProduct + shippingFeeShop - voucherDiscountOnShipping;

            user.wallet = (user.wallet || 0) + refundAmount;
            await user.save();

            resolve({
                message: "Đã hoàn trả sản phẩm của shop thành công, tiền đã được cộng vào ví người dùng.",
                order: orderBill,
                refundAmount,
            });
        } catch (error) {
            reject(error);
        }
    });
};





module.exports = {
    getAllShippingCustomer,
    addShippingCustomer,
    orderProduct,
    getAllOrderByStatus,
    successfulDelivered,
    canceledOrder,
    removeShippingAddress,
    returnOrder
};