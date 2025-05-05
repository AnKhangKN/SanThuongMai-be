const User = require("../../models/User");

const getDetailAccountUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const detailUser = await User.findOne({_id: userId});


            if (!detailUser) {
                return reject({
                    status: "ERROR",
                    message: "Không tìm thấy người dùng",
                });
            }

            resolve({
                status: "OK",
                message: "Lấy thông tin thành công",
                data: detailUser,
            });
        } catch (error) {
            reject({
                status: "ERROR",
                message: error.message || "Lỗi khi truy vấn dữ liệu người dùng",
            });
        }
    });
};

const updateAccountUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({_id: id});

            if (!checkUser) {
                return resolve({
                    status: "ERROR",
                    message: "Không tìm thấy người dùng",
                });
            }

            const updatedUser = await User.findOneAndUpdate(
                {_id: id},
                {$set: data},
                {new: true}
            );

            resolve({
                status: "OK",
                message: "Cập nhật thành công",
                data: updatedUser,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const partialUpdateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({_id: id});

            if (!checkUser) {
                return reject({
                    status: "ERROR",
                    message: "Không tìm thấy người dùng",
                });
            }

            const updatedUser = await User.findOneAndUpdate(
                {_id: id},
                {$set: data},
                {new: true}
            );

            resolve({
                status: "OK",
                message: "Cập nhật thành công",
                data: updatedUser,
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    getDetailAccountUser,
    updateAccountUser,
    partialUpdateUser,
};
