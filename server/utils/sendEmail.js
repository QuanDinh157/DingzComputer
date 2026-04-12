const nodemailer = require("nodemailer");
require("dotenv").config();

const sendOrderEmail = async (emailTo, orderId, totalPrice, customerName) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
    });

    const mailOptions = {
      from: `"Dingz Computer" <${process.env.EMAIL_USER}>`,
      to: emailTo,
      subject: `[Dingz Computer] Xác nhận đơn hàng #${orderId.toString().slice(-6).toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #0d47a1; text-align: center;">CẢM ƠN BẠN ĐÃ ĐẶT HÀNG!</h2>
          <p>Xin chào <strong>${customerName}</strong>,</p>
          <p>Dingz Computer đã nhận được yêu cầu đặt hàng của bạn. Chúng tôi đang tiến hành xử lý đơn hàng trong thời gian sớm nhất.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Mã đơn hàng:</strong> <span style="color: #d32f2f; font-weight: bold;">${orderId.toString().slice(-6).toUpperCase()}</span></p>
            <p><strong>Tổng thanh toán:</strong> <span style="color: #d32f2f; font-weight: bold;">${totalPrice.toLocaleString("vi-VN")} VNĐ</span></p>
            <p><strong>Trạng thái:</strong> CHỜ DUYỆT</p>
          </div>

          <p>Bạn có thể theo dõi trạng thái đơn hàng tại mục <strong>Lịch sử mua hàng</strong> trên website.</p>
          <p>Mọi thắc mắc vui lòng liên hệ Hotline: <strong>0902876722</strong>.</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p style="text-align: center; color: #888; font-size: 12px;">Trân trọng,<br>Đội ngũ Dingz Computer</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("=> Đã gửi email xác nhận tới:", emailTo);
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
  }
};

module.exports = sendOrderEmail;
