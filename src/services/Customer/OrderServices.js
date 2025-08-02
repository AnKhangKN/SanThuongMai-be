const User = require("../../models/User");
const Order = require("../../models/Order");
const PlatformFees = require("../../models/PlatformFees");
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

            // Xử lý trạng thái đặc biệt: lấy cả returned + cancelled
            if (status) {
                if (typeof status !== 'string' || !status.trim()) {
                    return reject(new Error("Status phải là chuỗi hợp lệ"));
                }

                const trimmedStatus = status.trim();

                if (trimmedStatus === "returnedOrCancelled") {
                    statusList = ["returned", "cancelled"];
                } else {
                    statusList = [trimmedStatus];
                }

                match["productItems.status"] = { $in: statusList };
            }

            // Lấy đơn hàng có ít nhất 1 sản phẩm phù hợp
            const orders = await Order.find(match);

            if (!orders.length) {
                return resolve({
                    status: "OK",
                    message: "Không có đơn hàng nào phù hợp",
                    data: []
                });
            }

            // Lọc từng item trong đơn
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
                          note
                      }) => {
    return new Promise(async (resolve, reject) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const user = await User.findById(userId).session(session);
            if (!user) throw new Error("User not found");

            for (const item of productItems) {
                const shop = await Shop.findById(item.shopId).session(session);
                if (!shop) throw new Error(`Shop not found for product: ${item.productName}`);

                shop.soldCount += item.quantity;
                await shop.save({ session });

                const product = await Product.findById(item.productId).session(session);
                if (!product) throw new Error(`Product not found: ${item.productName}`);

                const matchedOption = product.priceOptions.find((option) => {
                    if (option.attributes.length !== item.attributes.length) return false;
                    return item.attributes.every((attr) =>
                        option.attributes.some(
                            (optAttr) =>
                                optAttr.name === attr.name &&
                                optAttr.value === attr.value
                        )
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

                const cart = await Cart.findOne({ userId }).session(session);

                if (cart) {
                    // Giữ lại những item KHÔNG thuộc về productItems đã đặt hàng
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

            // Giảm usageLimit của voucher
            for (const voucher of vouchers) {
                const foundVoucher = await Voucher.findById(voucher.voucherId).session(session);
                if (foundVoucher) {
                    foundVoucher.usageLimit = Math.max(foundVoucher.usageLimit - 1, 0);
                    await foundVoucher.save({ session });
                }
            }

            // Gán trạng thái cho từng productItem
            const productItemsWithStatus = productItems.map(item => ({
                ...item,
                status: paymentMethod === "Online" ? "processing" : "pending"
            }));

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
                note,
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

const canceledOrder = async (user_id, { order, status, cancelReason }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const paymentMethod = order.payment_method;
            const totalBill = order.total_price;

            if (paymentMethod === 'cod') {
                const successDelivered = await Order.findByIdAndUpdate(order._id, {
                    status: status,
                    cancel_reason: cancelReason
                }, { new: true });

                resolve({
                    status: "success",
                    message: "Thành công",
                    data: successDelivered
                });
            } else if (paymentMethod === 'credit_card') {
                const successDelivered = await Order.findByIdAndUpdate(order._id, {
                    status: status,
                    cancel_reason: cancelReason
                }, { new: true });

                await User.findByIdAndUpdate(user_id, {
                    $inc: { wallet: totalBill },
                }, { new: true });

                resolve({
                    status: "success",
                    message: "Thành công",
                    data: successDelivered
                });
            } else {
                resolve({
                    status: "fail",
                    message: "Phương thức không hợp lệ"
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const removeShippingAddress = (user_id, shippingAddress) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findById(user_id);

            if (!user) {
                return reject(new Error("Người dùng không tồn tại"));
            }

            if (!user.shipping_address || user.shipping_address.length === 0) {
                return reject(new Error("Người dùng không có địa chỉ giao hàng"));
            }

            const initialLength = user.shipping_address.length;

            // Lọc danh sách địa chỉ giao hàng để loại bỏ địa chỉ cần xóa
            user.shipping_address = user.shipping_address.filter(
                (addr) =>
                    addr.phone !== shippingAddress.phone ||
                    addr.address !== shippingAddress.address ||
                    addr.city !== shippingAddress.city
            );

            if (user.shipping_address.length === initialLength) {
                return reject(new Error("Không tìm thấy địa chỉ giao hàng để xóa"));
            }

            // Lưu lại thông tin người dùng sau khi xóa địa chỉ
            await user.save();

            resolve({
                status: "success",
                message: "Địa chỉ giao hàng đã được xóa thành công",
                data: user.shipping_address
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
    removeShippingAddress
};