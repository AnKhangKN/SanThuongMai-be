const User = require("../../models/User");
const bcrypt = require("bcrypt"); // mã hóa mật khẩu
const {
    generateAccessToken,
    generateRefreshToken,
} = require("../../utils/jwt");

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const {email, password} = userLogin;

        try {
            // Tìm user theo email
            const checkUser = await User.findOne({email: email});

            // Kiểm tra email có tồn tại không
            if (!checkUser) {
                return reject({
                    status: "ERROR",
                    message: "Email không tồn tại", // Sử dụng reject thay vì resolve
                });
            }

            // Kiểm tra trạng thái tài khoản
            const accountStatus = checkUser.account_status;

            if (accountStatus === "banned") {
                return reject({
                    status: "ERROR",
                    message: "Tài khoản của bạn đã bị khóa!", // Sử dụng reject
                });
            }

            if (accountStatus === "inactive") {
                return reject({
                    status: "ERROR",
                    message: "Tài khoản của bạn bị vô hiệu hóa!", // Sử dụng reject
                });
            }

            // Kiểm tra mật khẩu
            const compare_password = bcrypt.compareSync(password, checkUser.password);

            if (!compare_password) {
                return reject({
                    status: "ERROR",
                    message: "Mật khẩu không đúng", // Sử dụng reject
                });
            }

            // Tạo access token
            const access_token = await generateAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
                isVendor: checkUser.isVendor,
            });

            // Tạo refresh token
            const refresh_token = await generateRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
                isVendor: checkUser.isVendor,
            });

            resolve({
                status: "OK",
                message: "Đăng nhập thành công",
                access_token,
                refresh_token,
            });
        } catch (error) {
            // Xử lý lỗi tổng quát
            reject({
                status: "ERROR",
                message: "Có lỗi xảy ra khi đăng nhập",
                error: error.message, // Cung cấp thông tin lỗi để dễ dàng debug
            });
        }
    });
};


const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const {email, password} = newUser;

        try {
            // Kiểm tra email đã tồn tại chưa
            const checkUser = await User.findOne({email});
            if (checkUser) {
                return reject({
                    status: "ERROR",
                    message: "Email đã được sử dụng!",
                });
            }

            // Mã hóa mật khẩu trước khi tạo tài khoản (sử dụng bcrypt.hash để không đồng bộ)
            const hash = await bcrypt.hash(password, 10);  // Sử dụng bcrypt.hash thay vì hashSync

            const createdUser = await User.create({
                email,
                password: hash,
            });

            // Nếu tạo thành công
            if (createdUser) {
                return resolve({
                    status: "OK",
                    message: "Tạo tài khoản thành công",
                    data: createdUser,
                });
            }

            // Nếu tạo không thành công (trường hợp hiếm gặp)
            return reject({
                status: "ERROR",
                message: "Không thể tạo tài khoản",
            });
        } catch (e) {
            // Xử lý lỗi chi tiết hơn để dễ dàng debug
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
