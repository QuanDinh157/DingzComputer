import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const VietQRPaymentComponent = ({ order }) => {
  const [loading, setLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const BANK_ID = "BIDV";
  const ACCOUNT_NO = "1170303639";
  const ACCOUNT_NAME = "DINH NGUYEN QUOC QUAN";

  const amount = order.totalPrice;
  const orderId = order._id
    ? order._id.substring(order._id.length - 6).toUpperCase()
    : "N/A";
  const customerName = order.customerName || "Khách hàng";
  const customerPhone = order.shippingAddress?.phone || "N/A";

  const addInfo = `DINGZ ${orderId} ${customerPhone.slice(-4)}`;
  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${addInfo}&accountName=${ACCOUNT_NAME}`;

  const handleProcessPayment = () => {
    if (!isConfirmed) {
      Swal.fire({
        title: "LƯU Ý THANH TOÁN",
        text: "Vui lòng thực hiện chuyển khoản qua mã QR trước khi xác nhận với hệ thống.",
        icon: "info",
        confirmButtonColor: "#0d47a1",
        confirmButtonText: "Tôi đã hiểu",
      });
      return;
    }

    Swal.fire({
      title: "XÁC NHẬN GIAO DỊCH",
      html: `Hệ thống sẽ tiến hành kiểm tra tài khoản cho đơn hàng <b>#${orderId}</b>.<br/>Bạn cam kết đã chuyển đúng số tiền <b>${amount.toLocaleString("vi-VN")}đ</b>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0d47a1",
      cancelButtonColor: "#757575",
      confirmButtonText: "Xác nhận đã chuyển",
      cancelButtonText: "Kiểm tra lại",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await axios.put(
            `https://dingzcomputer.onrender.com/api/orders/${order._id}/pay-confirm`,
          );

          Swal.fire({
            title: "THÔNG BÁO",
            text: "Yêu cầu của bạn đã được gửi tới bộ phận kế toán. Đơn hàng sẽ được duyệt ngay khi nhận được tiền.",
            icon: "success",
            confirmButtonColor: "#2e7d32",
          }).then(() => {
            window.location.href = "/home";
          });
        } catch (error) {
          Swal.fire(
            "THÔNG BÁO",
            "Hệ thống đang bận, vui lòng thử lại sau ít phút.",
            "error",
          );
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "30px auto",
        border: "1px solid #d1d1d1",
        borderRadius: "16px",
        backgroundColor: "#fff",
        boxShadow: "0 15px 35px rgba(0,0,0,0.05)",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#0d47a1",
          padding: "25px",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "22px",
            fontWeight: "600",
            letterSpacing: "1px",
          }}
        >
          HỆ THỐNG THANH TOÁN VIETQR
        </h2>
        <p style={{ margin: "8px 0 0", fontSize: "14px", opacity: 0.9 }}>
          Dingz Computer - An toàn & Bảo mật
        </p>
      </div>

      <div style={{ padding: "30px" }}>
        <div
          style={{
            marginBottom: "25px",
            padding: "15px",
            backgroundColor: "#f4f7fa",
            borderRadius: "10px",
            borderLeft: "4px solid #0d47a1",
          }}
        >
          <h4
            style={{ margin: "0 0 10px", color: "#0d47a1", fontSize: "15px" }}
          >
            THÔNG TIN ĐƠN HÀNG
          </h4>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "14px",
              marginBottom: "5px",
            }}
          >
            <span style={{ color: "#666" }}>Mã đơn hàng:</span>
            <span style={{ fontWeight: "600" }}>#{orderId}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "14px",
              marginBottom: "5px",
            }}
          >
            <span style={{ color: "#666" }}>Khách hàng:</span>
            <span style={{ fontWeight: "600" }}>{customerName}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "14px",
            }}
          >
            <span style={{ color: "#666" }}>Số điện thoại:</span>
            <span style={{ fontWeight: "600" }}>{customerPhone}</span>
          </div>
        </div>

        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <div
            style={{
              display: "inline-block",
              padding: "12px",
              border: "1px solid #eee",
              borderRadius: "12px",
              backgroundColor: "#fff",
            }}
          >
            <img
              src={qrUrl}
              alt="QR Thanh Toán"
              style={{ width: "220px", height: "220px", display: "block" }}
            />
          </div>
          <p style={{ fontSize: "12px", color: "#888", marginTop: "12px" }}>
            Vui lòng quét mã bằng App Ngân hàng hoặc Ví điện tử
          </p>
        </div>

        <div
          style={{
            borderTop: "1px solid #eee",
            paddingTop: "20px",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <span style={{ fontSize: "14px", color: "#666" }}>
              Ngân hàng thụ hưởng:
            </span>
            <span
              style={{ fontSize: "14px", fontWeight: "700", color: "#10526e" }}
            >
              BIDV
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <span style={{ fontSize: "14px", color: "#666" }}>
              Nội dung chuyển khoản:
            </span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: "#d32f2f",
                padding: "2px 8px",
                backgroundColor: "#fff1f0",
                borderRadius: "4px",
              }}
            >
              {addInfo}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <span style={{ fontSize: "16px", fontWeight: "600" }}>
              TỔNG THANH TOÁN:
            </span>
            <span
              style={{ fontSize: "22px", fontWeight: "700", color: "#0d47a1" }}
            >
              {amount.toLocaleString("vi-VN")} VNĐ
            </span>
          </div>
        </div>

        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <input
            type="checkbox"
            id="confirmCheck"
            checked={isConfirmed}
            onChange={(e) => setIsConfirmed(e.target.checked)}
            style={{
              width: "18px",
              height: "18px",
              marginTop: "2px",
              cursor: "pointer",
            }}
          />
          <label
            htmlFor="confirmCheck"
            style={{
              fontSize: "13px",
              color: "#555",
              cursor: "pointer",
              lineHeight: "1.4",
            }}
          >
            Tôi xác nhận đã chuyển khoản đúng số tiền và nội dung như thông tin
            ở trên.
          </label>
        </div>

        <button
          onClick={handleProcessPayment}
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            backgroundColor: isConfirmed ? "#0d47a1" : "#b0bec5",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: isConfirmed ? "pointer" : "not-allowed",
            transition: "all 0.3s",
          }}
        >
          {loading ? "ĐANG XỬ LÝ HỆ THỐNG..." : "XÁC NHẬN HOÀN TẤT THANH TOÁN"}
        </button>
      </div>

      <div
        style={{
          backgroundColor: "#f9f9f9",
          padding: "15px",
          textAlign: "center",
          fontSize: "12px",
          color: "#999",
          borderTop: "1px solid #eee",
        }}
      >
        Mọi thắc mắc vui lòng liên hệ Hotline: 1900 xxxx
      </div>
    </div>
  );
};

export default VietQRPaymentComponent;
