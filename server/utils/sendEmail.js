const nodemailer = require("nodemailer");

const sendOrderEmail = async (emailTo, orderId, totalPrice, customerName) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "142.251.10.108",
      port: 465,
      secure: true,
      auth: {
        user: "dingzcraft157@gmail.com",
        pass: "nqplkwezpdykpkij",
      },
      tls: {
        rejectUnauthorized: false,
        servername: "smtp.gmail.com",
      },
    });

    const mailOptions = {
      from: '"Dingz Computer" <dingzcraft157@gmail.com>',
      to: emailTo,
      subject: `[Dingz Computer] Xác nhận đơn hàng #${orderId.toString().slice(-6).toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #0d47a1; text-align: center;">CẢM ƠN BẠN ĐÃ ĐẶT HÀNG!</h2>
          <p>Xin chào <strong>${customerName}</strong>,</p>
          <p>Đơn hàng của bạn đã được tiếp nhận thành công.</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Mã đơn hàng:</strong> ${orderId.toString().slice(-6).toUpperCase()}</p>
            <p><strong>Tổng tiền:</strong> ${totalPrice.toLocaleString("vi-VN")} VNĐ</p>
          </div>
          <p>Hotline hỗ trợ: 0902876722</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("=> Mail đã gửi!");
  } catch (error) {
    console.error("Lỗi gửi mail thực tế:", error.message);
  }
};

module.exports = sendOrderEmail;
