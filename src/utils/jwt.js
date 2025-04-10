const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const generateAccessToken = (payload) => {
  const access_token = jwt.sign(
    {
      payload,
    },
    process.env.ACCESS_TOKEN, // SECRET KEY
    {
      expiresIn: "30s", // Token hết hạn sau 30s
    }
  );

  return access_token;
};

const generateRefreshToken = (payload) => {
  const refresh_token = jwt.sign(
    {
      payload,
    },
    process.env.REFRESH_TOKEN, // SECRET KEY
    {
      expiresIn: "365d", // Token hết hạn sau 365 ngày
    }
  );

  return refresh_token;
};

const refreshTokenService = (refreshToken) => {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN, async (err, user) => {
        if (err) {
          reject({
            status: "ERROR",
            message: "Token không hợp lệ",
          });
        }
        const { payload } = user;

        const access_token = await generateAccessToken({
          id: payload.id,
          isAdmin: payload?.isAdmin,
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
