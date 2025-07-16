const VoucherServices = require("../../services/Admin/VoucherServices");

const createVoucher = async (req, res) => {
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
        } = req.body

        if (!voucherName || !category || !type || !value || !startDate || !endDate) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin bắt buộc." });
        }

        const result = await VoucherServices.createVoucher({
            voucherName,
            description,
            category,
            type,
            value,
            maxDiscount,
            minOrderValue,
            usageLimit,
            startDate,
            endDate,
        });

        return res.status(201).json(result)

    } catch (error) {
        return res.status(400).json({
            message: error.message || "Internal Server Error",
        })
    }
}

const getVouchers = async (req, res) => {
    try {

        const result = await VoucherServices.getVouchers();
        return res.status(200).json(result);

    } catch (error) {
        return res.status(400).json({
            message: error.message || "Internal Server Error",
        })
    }
}

module.exports = {
    createVoucher,
    getVouchers
}