const User = require("../../models/User");

const getAllShops = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const shops = await User.find({
                $or: [
                    { "shop.name": { $exists: true, $ne: null } },
                    { "shop.status": { $exists: true, $ne: null } }
                ]
            });

            resolve({
                status: "OK",
                message: "Lấy danh sách cửa hàng thành công",
                data: shops,
            });
        } catch (error) {
            console.error("→ Lỗi khi lấy danh sách cửa hàng:", error);
            reject({
                status: "ERROR",
                message: "Đã xảy ra lỗi khi lấy danh sách cửa hàng",
                error,
            });
        }
    });
};

const partialUpdateShop = (ownerId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkShop = await User.findOne({ _id: ownerId });

            if (!checkShop) {
                return resolve({
                    status: "ERROR",
                    message: "Không tìm thấy người dùng",
                });
            }

            const updatedShop = await User.findOneAndUpdate(
                { _id: ownerId },
                { $set: { "shop.status": data.shop.status } },
                { new: true }
            );

            resolve({
                status: "OK",
                message: "Cập nhật trạng thái người dùng thành công",
                data: updatedShop,
            });
        } catch (error) {
            console.error("→ Lỗi cập nhật:", error);
            reject({
                status: "ERROR",
                message: "Đã xảy ra lỗi trong quá trình cập nhật",
                error,
            });
        }
    });
};

const getAllReportedShops = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const shops = await User.find({
                "shop.reports.0": { $exists: true }
            });

            resolve({
                status: "OK",
                message: "Lấy danh sách cửa hàng bị báo cáo thành công",
                data: shops,
            });
        } catch (error) {
            console.error("→ Lỗi khi lấy danh sách báo cáo:", error);
            reject({
                status: "ERROR",
                message: "Đã xảy ra lỗi khi lấy danh sách báo cáo",
                error,
            });
        }
    });
};

const partialUpdateReportedShop = (ownerId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!ownerId || !data) {
                return resolve({
                    status: "ERROR",
                    message: "Thiếu thông tin đầu vào (ownerId hoặc data)",
                });
            }

            const checkShop = await User.findOne({ _id: ownerId });

            if (!checkShop) {
                return resolve({
                    status: "ERROR",
                    message: "Không tìm thấy người dùng",
                });
            }

            // Chuyển shop: { status: '...' } => { 'shop.status': '...' }
            const updateFields = {};
            for (const key in data.shop) {
                updateFields[`shop.${key}`] = data.shop[key];
            }

            const updatedShop = await User.findOneAndUpdate(
                { _id: ownerId },
                { $set: updateFields },
                { new: true }
            );

            if (!updatedShop) {
                return resolve({
                    status: "ERROR",
                    message: "Không thể cập nhật người dùng",
                });
            }

            resolve({
                status: "OK",
                message: "Cập nhật trạng thái người dùng thành công",
                data: updatedShop,
            });
        } catch (error) {
            console.error("→ Lỗi cập nhật:", error);
            reject({
                status: "ERROR",
                message: "Đã xảy ra lỗi trong quá trình cập nhật",
                error,
            });
        }
    });
};

module.exports = {
    getAllShops,
    partialUpdateShop,
    getAllReportedShops,
    partialUpdateReportedShop
};
