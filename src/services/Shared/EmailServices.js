const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // Sử dụng để tạo mật khẩu ngẫu nhiên

dotenv.config();

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Hàm gửi email xác nhận đăng ký tài khoản
const sendEmailVerification = async (email) => {
    try {
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const verificationLink = `http://localhost:3000/verify/${token}`;

        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Xác nhận email của bạn</h2>
                <p>Vui lòng nhấp vào liên kết bên dưới để xác nhận email của bạn:</p>
                <a href="${verificationLink}" style="display: inline-block; margin-top: 10px; padding: 10px 15px; background-color: #4CAF50; color: #fff; text-decoration: none;">Xác nhận email</a>
                <p>Nếu bạn không đăng ký tài khoản, vui lòng bỏ qua email này.</p>
            </div>
        `;

        const info = await transporter.sendMail({
            from: process.env.EMAIL_ACCOUNT,
            to: email,
            cc: process.env.EMAIL_ACCOUNT, // Test thôi
            subject: "Xác nhận email của bạn",
            html: emailHtml,
        });

        console.log("Message sent:", info.messageId);
        return {
            status: "success",
            message: "Email xác nhận đã được gửi!",
            messageId: info.messageId,
        };
    } catch (error) {
        console.error("Lỗi khi gửi email xác nhận:", error);
        return {
            status: "error",
            message: "Gửi email xác nhận thất bại!",
            error: error.message,
        };
    }
};

// Hàm gửi email tạo đơn hàng
const sendEmailCreateOrder = async (email, items) => {
    try {
        // Tính tổng tiền
        const totalAmount = items.reduce((total, item) => {
            return total + item.quantity * parseFloat(item.price);
        }, 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

        // Tạo danh sách sản phẩm dưới dạng HTML
        const itemsListHtml = items.map((item, index) => `
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.product_name}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${parseFloat(item.price).toLocaleString("vi-VN")} VND</td>
            </tr>
        `).join("");

        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Cảm ơn bạn đã mua hàng tại HKN!</h2>
                <p>Đây là danh sách sản phẩm bạn đã đặt hàng:</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <thead>
                        <tr style="background-color: #f2f2f2;">
                            <th>STT</th><th>Tên sản phẩm</th><th>Số lượng</th><th>Giá</th>
                        </tr>
                    </thead>
                    <tbody>${itemsListHtml}</tbody>
                </table>
                <h3>Tổng cộng: ${totalAmount}</h3>
                <p>Chúng tôi sẽ liên hệ với bạn sớm để xác nhận đơn hàng.</p>
                <p>Trân trọng,<br>Đội ngũ HKN</p>
            </div>
        `;

        const info = await transporter.sendMail({
            from: process.env.EMAIL_ACCOUNT,
            to: email,
            cc: process.env.EMAIL_ACCOUNT, // Test thôi
            subject: "Cảm ơn bạn đã ghé mua hàng tại HKN",
            html: emailHtml,
        });

        console.log("Message sent:", info.messageId);
        return {
            status: "success",
            message: "Email đã được gửi!",
            messageId: info.messageId,
        };
    } catch (error) {
        console.error("Lỗi khi gửi email:", error);
        return {
            status: "error",
            message: "Gửi email thất bại!",
            error: error.message,
        };
    }
};

// Quên mật khẩu
const sendEmailForgetPassword = async (email, password) => {
    try {
        if (!transporter) {
            throw new Error("Transmitter is not configured properly.");
        }

        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #333;">Đây là mật khẩu mặc định của bạn!</h2>
                <h3 style="color: #555;">Mật khẩu: <strong style="color: #d32f2f;">${password}</strong></h3>
                <p>Vui lòng đăng nhập và đổi mật khẩu để đảm bảo an toàn.</p>
                <p>Trân trọng,<br><strong>Đội ngũ HKN</strong></p>
            </div>
        `;

        const info = await transporter.sendMail({
            from: process.env.EMAIL_ACCOUNT,
            to: email,
            subject: "Cảm ơn bạn đã ghé mua hàng tại HKN",
            html: emailHtml,
        });

        console.log("✅ Email sent successfully:", info.messageId);

        return {
            status: "success",
            message: "Email đã được gửi!",
            password, // Trả về mật khẩu để có thể lưu vào DB
            messageId: info.messageId,
        };
    } catch (error) {
        console.error("❌ Lỗi khi gửi email:", error);
        return {
            status: "error",
            message: "Gửi email thất bại!",
            error: error.message,
        };
    }
};



module.exports = {
    sendEmailCreateOrder,
    sendEmailVerification,
    sendEmailForgetPassword
};