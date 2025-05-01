const User = require("../models/User");

const checkVendorBanStatus = async (req, res, next) => {
    try {
        const { email, banned_until } = req.body; // Lấy email và thời gian cấm từ request

        if (!email) {
            return res.status(400).json({ message: "Vui lòng cung cấp email." });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Không xác định được người dùng." });
        }

        // Nếu không phải là vendor, bỏ qua middleware này
        if (!user.isVendor) {
            return next();
        }

        const currentTime = Date.now();
        const bannedUntil = new Date(banned_until).getTime(); // Chuyển thời gian cấm từ request thành kiểu milliseconds

        // Khởi tạo banned_count nếu chưa có
        if (typeof user.shop.banned_count !== "number") {
            user.shop.banned_count = 0;
        }

        // Nếu vẫn đang bị khóa
        if (bannedUntil && currentTime < bannedUntil) {
            return res.status(403).json({
                message: `Cửa hàng của bạn đang bị khóa đến ${new Date(bannedUntil)}. Số lần bị cấm: ${user.shop.banned_count}`,
            });
        }

        // Nếu hết thời gian cấm nhưng trạng thái vẫn là "banned", mở lại cửa hàng và cộng thêm 1 lần bị cấm
        if (user.shop.status === "banned" && currentTime >= bannedUntil) {
            user.shop.status = "active";
            user.shop.banned_until = null; // Reset thời gian khóa

            user.shop.banned_count += 1;

            // Nếu số lần bị cấm đạt 5, chuyển trạng thái thành "inactive"
            if (user.shop.banned_count >= 5) {
                user.shop.status = "inactive";
                await user.save();
                return res.status(403).json({
                    message: `Cửa hàng của bạn đã bị khóa vĩnh viễn vì đã bị cấm quá 5 lần.`,
                });
            }

            await user.save();
            return res.status(200).json({
                message: "Cửa hàng của bạn đã được mở lại.",
            });
        }

        // Chỉ thay đổi trạng thái thành "banned" nếu có thời gian cấm
        if (bannedUntil && currentTime < bannedUntil) {
            user.shop.status = "banned"; // Cập nhật trạng thái "banned"
            user.shop.banned_until = bannedUntil; // Cập nhật thời gian cấm

            await user.save();

            return res.status(403).json({
                message: `Cửa hàng của bạn đã bị khóa đến ${new Date(bannedUntil)}. Tổng số lần bị cấm: ${user.shop.banned_count}`,
            });
        }

        await user.save();

        return next();
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi máy chủ",
            error: error.message,
        });
    }
};

module.exports = checkVendorBanStatus;
