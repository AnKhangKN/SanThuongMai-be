const User = require("../../models/User");

const getAllShops = async () => {
    try {

        const shops = await User.find({
            $or: [
                { "shop.name": { $exists: true, $ne: null } },
                { "shop.status": { $exists: true, $ne: null } }
            ]
        });

        return {
            status: "OK",
            message: "Lấy danh sách cửa hàng thành công",
            data: shops,
        };
    } catch (error) {
        throw error;
    }
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

            const partialUpdateShop = await User.findOneAndUpdate(
                { _id: ownerId },
                { $set: data },
                { new: true }
            );

            resolve({
                status: "OK",
                message: "Cập nhật trạng thái người dùng thành công",
                data: partialUpdateShop,
            });
        } catch (error) {
            console.error("→ Lỗi cập nhật:", error); // <--- nếu có lỗi
            reject(error);
        }
    });
};


module.exports = { getAllShops, partialUpdateShop };
