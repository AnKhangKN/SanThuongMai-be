const User = require("../../models/User");
const Order = require("../../models/Order");
const PlatformFees = require("../../models/PlatformFees");
const Product = require("../../models/Product");
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
            const user = await User.findById(user_id).select('shipping_address');

            if (!user) {
                return reject({
                    status: 'error',
                    message: 'Người dùng không tồn tại'
                });
            }

            resolve({
                status: 'success',
                message: 'Successfully fetched shipping addresses',
                data: user.shipping_address // Trả ra mảng shipping_address
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

const addShippingCustomer = (user_id, shippingInfo) => {
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

            const shipping = shippingInfo.shipping_address



            // Kiểm tra dữ liệu shippingInfo có đầy đủ không (bổ sung nhẹ nhàng)
            if (!shippingInfo || !shipping.phone || !shipping.address || !shipping.city) {
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
                        shipping_address: {
                            phone: shipping.phone,
                            address: shipping.address,
                            city: shipping.city,
                        }
                    }
                },
                { new: true }
            );

            resolve({
                status: 'success',
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
            // Kiểm tra xem người dùng có tồn tại không
            const user = await User.findById(user_id);
            if (!user) {
                return reject(new Error("Người dùng không tồn tại"));
            }

            // Khởi tạo đối tượng filter
            const filter = {
                user_id: user_id
            };

            // Kiểm tra xem status có được truyền vào và có phải là chuỗi không
            if (status) {
                if (typeof status !== 'string' || !status.trim()) {
                    return reject(new Error("Status phải là chuỗi hợp lệ"));
                }
                filter.status = status.trim(); // trim để loại bỏ các ký tự khoảng trắng thừa
            }

            // Truy vấn các đơn hàng từ cơ sở dữ liệu
            const orders = await Order.find(filter);

            // Kiểm tra xem có đơn hàng nào không
            if (orders.length === 0) {
                return resolve({
                    status: "OK",
                    message: "Không có đơn hàng nào phù hợp",
                    data: []
                });
            }

            // Trả về kết quả thành công
            resolve({
                status: "OK",
                message: "Lấy đơn hàng thành công",
                data: orders
            });

        } catch (error) {
            // Xử lý lỗi chi tiết
            console.error("Lỗi khi lấy đơn hàng:", error);
            reject({
                status: "ERROR",
                message: error.message || "Đã xảy ra lỗi không xác định",
            });
        }
    });
};

const orderProduct = (user_id, shippingInfo, items, totalBill, paymentMethod) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!user_id) {
                return reject({
                    status: 'error',
                    message: "Không tìm thấy người dùng"
                });
            }

            // Lấy phí nền tảng
            const fee = await PlatformFees.findOne({ fee_name: "order" });
            if (!fee) {
                return reject({
                    status: 'error',
                    message: "Không có chi phí nền tảng"
                });
            }

            const platform_fee_id = fee._id;
            const fee_type = fee.fee_type;
            const value = fee.value;

            const fee_value = value/100;

            // Tính phí nền tảng
            let fee_price;

            if (fee_type === "percentage"){
                fee_price = fee_value * totalBill
            } else {
                fee_price = 20000;
            }

            // Tính các khoản chi phí khác
            const taxRate = parseFloat(process.env.TAX_FEE) || 0.05; // 5% thuế
            const tax_price = totalBill * taxRate;
            const shipping_price = parseFloat(process.env.SHIPPING_FEE) || 30000; // phí ship mặc định

            const isPaid = paymentMethod === "credit_card";

            // Tạo đơn hàng
            const newOrder = await Order.create({
                user_id,
                shipping_address: {
                    phone: shippingInfo.phone,
                    address: shippingInfo.address,
                    city: shippingInfo.city,
                },
                items: items.map(item => ({
                    product_id: item.product_id,
                    product_image: item.product_img,
                    product_name: item.product_name,
                    size: item.size,
                    color: item.color,
                    price: item.price,
                    quantity: item.quantity,
                    owner_id: item.owner_id
                })),
                total_price: totalBill,
                tax_price,
                shipping_price,
                payment_method: paymentMethod,
                is_paid: isPaid,
                paid_at: isPaid ? new Date() : null,
                platform_fee: {
                    platform_fee_id,
                    value: fee_price,
                    fee_type
                },
                status: isPaid ? "processing" : "pending",
            });

            const updates = [];

            // Chỉnh số lượng tồn kho và sold_count
            for (const item of items) {
                try {

                    const productId = new mongoose.Types.ObjectId(item.product_id);

                    const product = await Product.findById(productId);

                    if (!product) {
                        console.warn("Không tìm thấy sản phẩm:", item.product_id);
                        continue;
                    }

                    const variant = product.details.find(detail =>
                        String(detail.size).trim().toLowerCase() === String(item.size).trim().toLowerCase() &&
                        String(detail.color).trim().toLowerCase() === String(item.color).trim().toLowerCase()
                    );

                    if (!variant) {
                        console.warn(`Không tìm thấy biến thể phù hợp (size=${item.size}, color=${item.color})`);
                        continue;
                    }

                    variant.quantity -= item.quantity;
                    if (variant.quantity < 0) variant.quantity = 0;

                    product.sold_count = (product.sold_count || 0) + item.quantity;

                    updates.push(product.save());

                } catch (err) {
                    console.error("Lỗi xử lý sản phẩm:", item.product_id, err.message);
                }
            }

            // Xóa từng sản phẩm đã mua khỏi cart (chỉ xóa sản phẩm đã mua)
            for (const item of items) {
                await Cart.updateOne(
                    { user_id },
                    { $pull: { items: { product_id: item.product_id } } }
                );
            }

            // Chạy tất cả cập nhật song song
            await Promise.all(updates);

            // Trả kết quả
            resolve({
                status: 'success',
                message: 'Đặt hàng thành công',
                order: newOrder
            });

        } catch (error) {
            console.error(error);
            reject({
                status: 'error',
                message: 'Lỗi khi đặt hàng',
                error: error.message
            });
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

        console.log(order)

        console.log(totalBill)
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
                    $inc: { wallet: vendorNet }
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


module.exports = {
    getAllShippingCustomer,
    addShippingCustomer,
    orderProduct,
    getAllOrderByStatus,
    successfulDelivered
};