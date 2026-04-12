import React, { Component } from "react";
import axios from "axios";

class OrderDetailComponent extends Component {
  handleUpdateStatus = async (newStatus) => {
    const { order } = this.props;

    const confirmMsg =
      newStatus === "shipping"
        ? "Xác nhận giao đơn hàng này và gửi mail cho khách?"
        : "Xác nhận hủy đơn hàng này?";

    if (window.confirm(confirmMsg)) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };

        const { data } = await axios.put(
          `https://${window.location.hostname}/api/orders/${order._id}/status`,
          { status: newStatus },
          config,
        );

        if (data) {
          alert(
            `Đơn hàng đã chuyển sang: ${newStatus === "shipping" ? "Đang giao" : "Đã hủy"}`,
          );
          window.location.reload();
        }
      } catch (error) {
        console.error("Lỗi cập nhật trạng thái:", error);
        alert(
          "Lỗi: " +
            (error.response?.data?.message || "Không thể cập nhật đơn hàng"),
        );
      }
    }
  };

  render() {
    const { order } = this.props;
    const productList = order.orderItems || order.items || [];

    const items = productList.map((item, index) => (
      <tr key={index} style={{ textAlign: "center" }}>
        <td>{index + 1}</td>
        <td style={{ textAlign: "left" }}>
          {item.name || item.product?.name || "Sản phẩm"}
        </td>
        <td>{item.quantity || item.qty}</td>
        <td style={{ fontWeight: "bold", color: "#d32f2f" }}>
          {(
            (item.price || item.product?.price || 0) *
            (item.quantity || item.qty || 1)
          ).toLocaleString()}{" "}
          VNĐ
        </td>
      </tr>
    ));

    return (
      <div
        style={{
          background: "#fff",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          marginTop: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h4
          style={{
            marginTop: 0,
            borderBottom: "2px solid #eee",
            paddingBottom: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            CHI TIẾT ĐƠN HÀNG:{" "}
            <span style={{ color: "#1e8e3e" }}>
              #{order._id.substring(order._id.length - 8).toUpperCase()}
            </span>
          </span>

          <span
            style={{
              fontSize: "0.8rem",
              padding: "4px 10px",
              borderRadius: "20px",
              background:
                order.status === "shipping"
                  ? "#fff3e0"
                  : order.status === "cancelled"
                    ? "#ffebee"
                    : "#e8f5e9",
              color:
                order.status === "shipping"
                  ? "#e67e22"
                  : order.status === "cancelled"
                    ? "#d32f2f"
                    : "#2e7d32",
              border: "1px solid",
            }}
          >
            {order.status === "shipping"
              ? "ĐANG GIAO"
              : order.status === "cancelled"
                ? "ĐÃ HỦY"
                : "CHỜ XỬ LÝ"}
          </span>
        </h4>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
            background: "#f9f9f9",
            padding: "15px",
            borderRadius: "5px",
          }}
        >
          <div>
            <p style={{ margin: "5px 0" }}>
              <b>Khách hàng:</b>{" "}
              {order.user?.name || order.customer?.name || "Khách hàng ẩn danh"}
            </p>
            <p style={{ margin: "5px 0" }}>
              <b>Địa chỉ:</b>{" "}
              {order.shippingAddress?.address || "Chưa cập nhật"}
            </p>
          </div>

          {order.status !== "shipping" && order.status !== "cancelled" && (
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => this.handleUpdateStatus("shipping")}
                style={{
                  padding: "10px 15px",
                  background: "#e67e22",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                XÁC NHẬN GIAO HÀNG
              </button>
              <button
                onClick={() => this.handleUpdateStatus("cancelled")}
                style={{
                  padding: "10px 15px",
                  background: "#fff",
                  color: "#d32f2f",
                  border: "1px solid #d32f2f",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                HỦY ĐƠN
              </button>
            </div>
          )}
        </div>

        <table
          border="1"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.95rem",
          }}
        >
          <thead>
            <tr style={{ background: "#222", color: "#fff" }}>
              <th style={{ padding: "10px" }}>STT</th>
              <th style={{ textAlign: "left" }}>Tên linh kiện</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {productList.length > 0 ? (
              items
            ) : (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#888",
                  }}
                >
                  Đơn hàng này không có chi tiết sản phẩm.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default OrderDetailComponent;
