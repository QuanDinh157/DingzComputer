import React, { Component } from "react";

class OrderDetailComponent extends Component {
  render() {
    const { order } = this.props;

    // Lấy danh sách sản phẩm
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
        }}
      >
        <h4
          style={{
            marginTop: 0,
            borderBottom: "2px solid #eee",
            paddingBottom: "10px",
          }}
        >
          CHI TIẾT ĐƠN HÀNG:{" "}
          <span style={{ color: "#1e8e3e" }}>
            #{order._id.substring(order._id.length - 8).toUpperCase()}
          </span>
        </h4>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "15px",
            background: "#f9f9f9",
            padding: "15px",
            borderRadius: "5px",
          }}
        >
          <div>
            <p style={{ margin: "5px 0" }}>
              <b>Khách hàng:</b>{" "}
              {order.user?.name || order.customer?.name || "Khách hàng ẩn danh"}{" "}
              - {order.user?.phone || order.customer?.phone || ""}
            </p>
            <p style={{ margin: "5px 0" }}>
              <b>Địa chỉ giao hàng:</b>{" "}
              {order.shippingAddress?.address ||
                order.customer?.address ||
                "Chưa cập nhật"}
            </p>
          </div>
          {/* Đã xóa cụm nút Duyệt/Hủy ở đây để tránh bị lặp giao diện */}
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
