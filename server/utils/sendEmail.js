const nodemailer = require("nodemailer");

const sendOrderEmail = async (emailTo, orderId, totalPrice, customerName) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "dingzcraft157@gmail.com",
        pass: "nqplkwezpdykpkij",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: `"Dingz Computer" <dingzcraft157@gmail.com>`,
      to: emailTo,
      subject: `[Dingz Computer] Xác nhận đơn hàng #${orderId.toString().slice(-6).toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #0d47a1; text-align: center;">CẢM ƠN BẠN ĐÃ ĐẶT HÀNG!</h2>
          <p>Xin chào <strong>${customerName}</strong>,</p>
          <p>Dingz Computer đã nhận được đơn hàng của bạn.</p>
          <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0;">
            <p><strong>Mã đơn:</strong> ${orderId.toString().slice(-6).toUpperCase()}</p>
            <p><strong>Tổng tiền:</strong> ${totalPrice.toLocaleString("vi-VN")} VNĐ</p>
          </div>
          <p>Hotline: 0902876722</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("=> THÀNH CÔNG RỒI SẾP ƠI! MAIL ĐÃ BAY!");
  } catch (error) {
    console.error("Lỗi gửi mail:", error.message);
  }
};

module.exports = sendOrderEmail;
