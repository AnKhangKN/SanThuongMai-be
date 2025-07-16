const Voucher = require("../../models/Voucher");

const getVouchers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const vouchers = await Voucher.find();

            resolve({
                message: "Vouchers found",
                vouchers,
            });
        } catch (error) {
            reject(error || "Internal Server Error");
        }
    });
};

module.exports = {
    getVouchers,
};
