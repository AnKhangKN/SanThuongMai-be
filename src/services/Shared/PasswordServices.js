const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { sendEmailForgetPassword } = require("../Shared/EmailServices");
const User = require("../../models/User");

const forgetPassword = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Tạo mật khẩu ngẫu nhiên dài 12 ký tự
            const password = crypto.randomBytes(6).toString("hex");
            const hash = await bcrypt.hash(password, 10);

            // Tìm và cập nhật người dùng
            const user = await User.findOneAndUpdate(
                { email: email },           // Điều kiện tìm kiếm
                { $set: { password: hash } }, // Cập nhật mật khẩu
                { new: true }               // Trả về người dùng đã cập nhật
            );

            if (!user) {
                return reject({
                    status: "error",
                    message: "Email không tồn tại!",
                });
            }

            // Gửi email với mật khẩu mới
            await sendEmailForgetPassword(email, password);

            resolve({
                status: "success",
                message: "Successfully verified",
                data: user,
            });

        } catch (error) {
            reject({
                status: "error",
                message: "Lỗi trong quá trình quên mật khẩu!",
                error: error.message,
            });
        }
    });
};

module.exports = {
    forgetPassword,
}