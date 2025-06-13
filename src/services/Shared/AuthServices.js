const User = require("../../models/User");
const bcrypt = require("bcrypt");
const { sendEmailVerification } = require("../Shared/EmailServices");
const jwt = require("jsonwebtoken");
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

            const checkEmailVerify = checkUser.email_verified;
            if (checkEmailVerify === false) {
                return reject({
                    status: "ERROR",
                    message: "Tài khoản của bạn chưa xác thực hãy xác thực trước khi đăng nhập!",
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
                email_verified: false,
            });

            if (createdUser) {


                await sendEmailVerification(email)

                return resolve({
                    status: "OK",
                    message: "Tạo tài khoản thành công! Vui lòng kiểm tra email để xác nhận.",
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

// Xác nhận email
const verifyEmail = async (req, res) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.VERIFY_EMAIL);
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).json({ status: "ERROR", message: "Người dùng không tồn tại." });
        }

        if (user.email_verified) {
            return res.status(400).json({ status: "ERROR", message: "Email đã được xác nhận." });
        }

        user.email_verified = true;
        await user.save();

        res.status(200).json({ status: "SUCCESS", message: "Xác nhận email thành công!" });
    } catch (err) {
        res.status(400).json({ status: "ERROR", message: "Token không hợp lệ hoặc đã hết hạn." });
    }
};



module.exports = {
    loginUser,
    createUser,
    verifyEmail
};
