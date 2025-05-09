const User = require("../../models/User");

const deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({_id: userId});

            if (!checkUser) {
                resolve({
                    status: "ERROR",
                    message: "Không tìm thấy người dùng",
                });
            }

            // await User.findOneAndDelete({ _id: userId });

            resolve({
                status: "OK",
                message: "Xóa thành công",
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
                return resolve({
                    status: "ERROR",
                    message: "Không tìm thấy người dùng",
                });
            }

            const partialUpdateUser = await User.findOneAndUpdate(
                {_id: id},
                {$set: data}, // cập nhật trạn thái người dùng account_status
                {new: true}
            );

            resolve({
                status: "OK",
                message: "Cập nhật trạng thái người dùng thành công",
                data: partialUpdateUser,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find();

            resolve({
                status: "OK",
                message: "Lấy danh sách thành công",
                data: allUser,
            });
        } catch (error) {
            reject(error);
        }
    });
};


module.exports = {
    deleteUser,
    partialUpdateUser,
    getAllUser,
};
