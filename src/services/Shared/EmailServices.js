const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

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

// Hàm gửi email
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

        // Nội dung HTML của email
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Cảm ơn bạn đã mua hàng tại HKN!</h2>
                <p>Đây là danh sách sản phẩm bạn đã đặt hàng:</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <thead>
                        <tr style="background-color: #f2f2f2;">
                            <th style="padding: 8px; border: 1px solid #ddd;">STT</th>
                            <th style="padding: 8px; border: 1px solid #ddd;">Tên sản phẩm</th>
                            <th style="padding: 8px; border: 1px solid #ddd;">Số lượng</th>
                            <th style="padding: 8px; border: 1px solid #ddd;">Giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsListHtml}
                    </tbody>
                </table>
                <h3 style="margin-top: 20px;">Tổng cộng: ${totalAmount}</h3>
                <p style="margin-top: 20px;">Chúng tôi sẽ liên hệ với bạn sớm để xác nhận đơn hàng.</p>
                <p style="color: #888;">Nếu bạn có bất kỳ câu hỏi nào, xin vui lòng liên hệ với chúng tôi.</p>
                <p>Trân trọng,<br>Đội ngũ HKN</p>
            </div>
        `;

        const info = await transporter.sendMail({
            from: process.env.EMAIL_ACCOUNT,
            to: email,                       // Người nhận
            cc: process.env.EMAIL_ACCOUNT,   // Gửi bản sao cho chính chủ
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

module.exports = {
    sendEmailCreateOrder,
};
