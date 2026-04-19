import React, { useState } from "react";
import axios from "axios";

const VietQRPaymentComponent = ({ order }) => {
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);

  const BANK_ID = "BIDV";
  const ACCOUNT_NO = "1170303639";
  const ACCOUNT_NAME = "DINH NGUYEN QUOC QUAN";

  const amount = order.totalPrice;
  const shortOrderId = order._id
    ? order._id.substring(order._id.length - 5).toUpperCase()
    : "TEST";
  const addInfo = `DINGZ DH${shortOrderId}`;
  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${addInfo}&accountName=${ACCOUNT_NAME}`;

  const handleConfirmPayment = async () => {
    try {
      setLoading(true);

      await axios.put(`/api/orders/${order._id}/pay-confirm`);

      setIsPaid(true);
      setLoading(false);
      alert(
        "Ghi nhận giao dịch! Đơn hàng đã được chuyển sang trạng thái CHỜ DUYỆT.",
      );

      window.location.reload();
    } catch (error) {
      setLoading(false);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
      console.error(error);
    }
  };

  return (
    <div
      style={{
        maxWidth: "450px",
        margin: "20px auto",
        border: "1px solid #eaeaea",
        borderRadius: "12px",
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#0d47a1",
          color: "white",
          padding: "15px",
          textAlign: "center",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "18px" }}>DINGZ COMPUTER</h2>
        <p style={{ margin: "5px 0 0 0", fontSize: "13px", opacity: 0.8 }}>
          Cổng thanh toán tự động VietQR
        </p>
      </div>

      <div
        style={{ padding: "20px", textAlign: "center", background: "#f8f9fa" }}
      >
        <img
          src={qrUrl}
          alt="Mã QR Thanh Toán BIDV"
          style={{ width: "200px", height: "200px", borderRadius: "10px" }}
        />
        <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
          <i>(Sử dụng App Ngân hàng hoặc Ví điện tử để quét mã)</i>
        </p>
      </div>

      <div style={{ padding: "20px", background: "white" }}>
        <div style={{ marginBottom: "10px", fontSize: "14px" }}>
          Ngân hàng:{" "}
          <strong style={{ color: "#10526e", float: "right" }}>BIDV</strong>
        </div>
        <div style={{ marginBottom: "10px", fontSize: "14px" }}>
          Chủ tài khoản:{" "}
          <strong style={{ color: "#333", float: "right" }}>
            {ACCOUNT_NAME}
          </strong>
        </div>
        <div style={{ marginBottom: "10px", fontSize: "14px" }}>
          Nội dung CK:{" "}
          <strong style={{ color: "#d32f2f", float: "right" }}>
            {addInfo}
          </strong>
        </div>
        <div
          style={{
            margin: "15px 0",
            fontSize: "16px",
            borderTop: "1px dashed #ccc",
            paddingTop: "15px",
          }}
        >
          <strong>TỔNG THANH TOÁN:</strong>
          <strong
            style={{ color: "#0d47a1", fontSize: "20px", float: "right" }}
          >
            {amount?.toLocaleString("vi-VN")} đ
          </strong>
        </div>

        <button
          onClick={handleConfirmPayment}
          disabled={isPaid || loading}
          style={{
            width: "100%",
            padding: "12px",
            background: isPaid ? "#2e7d32" : "#0d47a1",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: isPaid ? "not-allowed" : "pointer",
          }}
        >
          {loading
            ? "ĐANG XỬ LÝ..."
            : isPaid
              ? "✓ ĐÃ YÊU CẦU DUYỆT ĐƠN"
              : "TÔI ĐÃ CHUYỂN KHOẢN XONG"}
        </button>
      </div>
    </div>
  );
};

export default VietQRPaymentComponent;
