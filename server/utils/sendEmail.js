const nodemailer = require("nodemailer");
const dns = require("dns");

const sendOrderEmail = async (emailTo, order, customerName, status = "new") => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        servername: "smtp.gmail.com",
      },
      lookup: (hostname, options, callback) => {
        return dns.lookup(hostname, { family: 4 }, callback);
      },
    });

    await transporter.verify();

    let subject = "";
    let statusText = "";
    let statusLabel = "";
    let color = "#0d47a1";
    const orderIdShort = order._id.toString().slice(-6).toUpperCase();

    switch (status) {
      case "shipping":
        subject = `[Dingz Computer] Đơn hàng #${orderIdShort} đang được giao`;
        statusText =
          "Đơn hàng của bạn đã được bàn giao cho đơn vị vận chuyển và đang trên đường đến tay bạn!";
        statusLabel = "Đang giao hàng";
        color = "#e67e22";
        break;
      case "cancelled":
        subject = `[Dingz Computer] Thông báo hủy đơn hàng #${orderIdShort}`;
        statusText =
          "Rất tiếc, đơn hàng của bạn đã bị hủy. Nếu có thắc mắc, vui lòng liên hệ hotline.";
        statusLabel = "Đã hủy";
        color = "#d32f2f";
        break;
      default:
        subject = `[Dingz Computer] Xác nhận đặt hàng #${orderIdShort} thành công`;
        statusText =
          "Cảm ơn bạn đã đặt hàng. Hệ thống đã tiếp nhận đơn hàng của bạn.";
        statusLabel = "Đã xác nhận";
    }

    // --- SỬA CHỖ NÀY: item.amount -> item.qty ---
    let itemsHtml = "";
    if (order.orderItems && order.orderItems.length > 0) {
      itemsHtml = order.orderItems
        .map(
          (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;"><strong>${item.name}</strong></td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.qty}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toLocaleString("vi-VN")} VNĐ</td>
        </tr>
      `,
        )
        .join("");
    }

    const finalPrice = order.totalPrice || order.total || 0;

    const mailOptions = {
      from: `"Dingz Computer" <${process.env.EMAIL_USER}>`,
      to: emailTo,
      subject: subject,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <div style="background-color: ${color}; color: white; padding: 25px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1.5px;">DINGZ COMPUTER</h1>
          </div>
          <div style="padding: 30px 20px;">
            <p style="font-size: 16px; color: #333;">Xin chào <strong>${customerName}</strong>,</p>
            <p style="font-size: 15px; color: #555; line-height: 1.6;">${statusText}</p>
            <div style="background-color: #f4f6f8; padding: 15px 20px; border-radius: 6px; border-left: 4px solid ${color}; margin: 25px 0;">
              <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Mã đơn hàng:</strong> #${orderIdShort}</p>
              <p style="margin: 0; font-size: 14px;"><strong>Trạng thái:</strong> <span style="color: ${color}; font-weight: bold;">${statusLabel}</span></p>
            </div>
            <h3 style="color: #333; font-size: 16px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Chi tiết đơn hàng</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background-color: #fafafa;">
                  <th style="text-align: left; padding: 12px; border-bottom: 2px solid #e0e0e0; color: #666; font-size: 14px;">Sản phẩm</th>
                  <th style="text-align: center; padding: 12px; border-bottom: 2px solid #e0e0e0; color: #666; font-size: 14px;">SL</th>
                  <th style="text-align: right; padding: 12px; border-bottom: 2px solid #e0e0e0; color: #666; font-size: 14px;">Giá</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            <div style="text-align: right; padding-top: 15px; border-top: 2px solid #e0e0e0;">
              <p style="margin: 0; font-size: 15px; color: #666;">Tổng thanh toán:</p>
              <p style="margin: 5px 0 0 0; font-size: 22px; font-weight: bold; color: ${color};">${finalPrice.toLocaleString("vi-VN")} VNĐ</p>
            </div>
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px dashed #ccc; text-align: center;">
              <p style="font-size: 13px; color: #888; margin: 0 0 5px 0;">Đây là email tự động từ hệ thống, vui lòng không trả lời.</p>
              <p style="font-size: 13px; color: #888; margin: 0;">Hotline hỗ trợ: <strong style="color: #333;">0902876722</strong></p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`=> [THÀNH CÔNG] Mail trạng thái [${status}] đã gửi!`);
  } catch (error) {
    console.error("Lỗi gửi mail:", error);
  }
};

module.exports = sendOrderEmail;
