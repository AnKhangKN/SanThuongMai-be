const VoucherService = require("../../services/Customer/VoucherServices");

const getVouchers = async (req, res) => {
    try {
        const result = await VoucherService.getVouchers();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
        });
    }
};

module.exports = {
    getVouchers,
};
