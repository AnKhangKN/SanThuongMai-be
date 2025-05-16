const PasswordServices = require("../../services/Shared/PasswordServices")

const forgetPassword = async (req, res) => {
    try {
        const data = req.body;

        const email = data.email.email
        console.log(data.email.email)

        // Đảm bảo hàm này là async và có await
        const result = await PasswordServices.forgetPassword(email);

        return res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi trong forgetPassword:", error);
        return res.status(500).json({
            message: error.message || "Something went wrong",
        });
    }
};


module.exports = {
    forgetPassword
}