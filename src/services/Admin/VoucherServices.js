const Voucher = require("../../models/Voucher"); // model mongoose

const createVoucher = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {
                voucherName,
                description,
                category,
                type, // 'percentage' | 'fixed'
                value, // ví dụ: 10% hoặc 50000 VNĐ
                maxDiscount, // dùng cho percentage
                minOrderValue,
                usageLimit,
                startDate,
                endDate,
            } = data;

            // Hàm tạo chuỗi random code
            const generateRandomCode = (length = 8) => {
                const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                let result = "";
                for (let i = 0; i < length; i++) {
                    result += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                return result;
            };

            // Tạo code duy nhất
            let code;
            let isUnique = false;
            while (!isUnique) {
                code = generateRandomCode();
                const existing = await Voucher.findOne({ code });
                if (!existing) isUnique = true;
            }

            const newVoucher = new Voucher({
                voucherName,
                description,
                category,
                type,
                value,
                maxDiscount,
                minOrderValue,
                usageLimit,
                usageCount: 0,
                code,
                startDate,
                endDate,
                isActive: true,
            });

            const saved = await newVoucher.save();
            resolve(saved);
        } catch (error) {
            reject(error);
        }
    });
};

const getVouchers = () => {
    return new Promise( async (resolve, reject) => {
        try {
            const vouchers = await Voucher.find();

            resolve({
                message: "success",
                vouchers,
            });

        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    createVoucher,
    getVouchers
}