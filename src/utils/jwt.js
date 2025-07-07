const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const generateAccessToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.ACCESS_TOKEN,
        { expiresIn: '60s' }
    );
};

const generateRefreshToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.REFRESH_TOKEN,
        { expiresIn: '365d' }
    )
};

const refreshTokenService = (refreshToken) => {
    return new Promise((resolve, reject) => {
        try {

            jwt.verify(refreshToken, process.env.REFRESH_TOKEN, async (err, user) => {
                if (err) {
                    return reject({
                        status: "ERROR",
                        message: "Token không hợp lệ",
                    });
                }

                // user chính là payload luôn
                const access_token = await generateAccessToken({
                    id: user?.id,
                    isAdmin: user?.isAdmin,
                    isVendor: user?.isVendor,
                });

                resolve({
                    status: "OK",
                    message: "Đăng nhập thành công",
                    access_token,
                });
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    refreshTokenService,
};
