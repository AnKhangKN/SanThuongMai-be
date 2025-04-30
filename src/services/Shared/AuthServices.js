const User = require("../../models/User");
const bcrypt = require("bcrypt");
const {
    generateAccessToken,
    generateRefreshToken,
} = require("../../utils/jwt");

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin;

        try {
            const checkUser = await User.findOne({ email });

            if (!checkUser) {
                return reject({
                    status: "ERROR",
                    message: "Email không tồn tại",
                });
            }

            const accountStatus = checkUser.account_status;
            if (accountStatus === "banned") {
                return reject({
                    status: "ERROR",
                    message: "Tài khoản của bạn đã bị khóa!",
                });
            }

            if (accountStatus === "inactive") {
                return reject({
                    status: "ERROR",
                    message: "Tài khoản của bạn bị vô hiệu hóa!",
                });
            }

            const isPasswordCorrect = await bcrypt.compare(password, checkUser.password); // dùng await

            if (!isPasswordCorrect) {
                return reject({
                    status: "ERROR",
                    message: "Mật khẩu không đúng",
                });
            }

            const payload = {
                id: checkUser._id,
                isAdmin: checkUser.isAdmin,
                isVendor: checkUser.isVendor,
            };

            const access_token = await generateAccessToken(payload);
            const refresh_token = await generateRefreshToken(payload);

            resolve({
                status: "OK",
                message: "Đăng nhập thành công",
                access_token,
                refresh_token,
            });
        } catch (error) {
            reject({
                status: "ERROR",
                message: "Có lỗi xảy ra khi đăng nhập",
                error: error.message,
            });
        }
    });
};

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = newUser;

        try {
            const checkUser = await User.findOne({ email });
            if (checkUser) {
                return reject({
                    status: "ERROR",
                    message: "Email đã được sử dụng!",
                });
            }

            const hash = await bcrypt.hash(password, 10);

            const createdUser = await User.create({
                email,
                password: hash,
            });

            if (createdUser) {
                return resolve({
                    status: "OK",
                    message: "Tạo tài khoản thành công",
                    data: createdUser,
                });
            } else {
                return reject({
                    status: "ERROR",
                    message: "Không thể tạo tài khoản",
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

module.exports = {
    loginUser,
    createUser,
};
