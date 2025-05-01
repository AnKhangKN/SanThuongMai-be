const PlatformFees = require("../../models/PlatformFees");

const getAllFees = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allFees = await PlatformFees.find();

            resolve({
                status: "OK",
                message: "Lấy danh sách phí nền tảng thành công",
                data: allFees,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const createPlatformFee = (newFee) => {
    return new Promise(async (resolve, reject) => {
        const { fee_type, fee_name, value, description } = newFee;

        try {
            const checkFee = await PlatformFees.findOne({ fee_name });
            if (checkFee) {
                return reject({
                    status: "ERROR",
                    message: "Đã tồn tại chi phí này!",
                });
            }

            const createdFee = await PlatformFees.create({
                fee_type,
                fee_name,
                value,
                description
            });

            if (createdFee) {
                return resolve({
                    status: "OK",
                    message: "Tạo chi phí nền tảng thành công",
                    data: createdFee,
                });
            } else {
                return reject({
                    status: "ERROR",
                    message: "Không thể tạo chi phí",
                });
            }
        } catch (e) {
            return reject({
                status: "ERROR",
                message: e.message || "Lỗi server",
            });
        }
    });
};

const updatePlatformFee = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const fee = await PlatformFees.findOneAndUpdate(
                { _id: id },
                { $set: data },
                { new: true }
            );

            resolve({
                status: "OK",
                message: "Cập nhật chi phí thành công.",
                data: fee
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    getAllFees,
    createPlatformFee,
    updatePlatformFee
};
