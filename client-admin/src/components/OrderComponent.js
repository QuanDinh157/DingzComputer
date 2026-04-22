import React, { Component } from "react";
import axios from "axios";
import OrderDetailComponent from "./OrderDetailComponent";
import Swal from "sweetalert2";

class OrderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      itemSelected: null,
      loading: true,
    };
  }

  componentDidMount() {
    this.apiGetOrders();
  }

  apiGetOrders = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const config = { headers: { Authorization: `Bearer ${token}` } };

    axios
      .get("https://dingzcomputer.onrender.com/api/orders", config)
      .then((res) => {
        let fetchedOrders = [];
        if (Array.isArray(res.data)) {
          fetchedOrders = res.data;
        } else if (res.data && Array.isArray(res.data.orders)) {
          fetchedOrders = res.data.orders;
        } else if (res.data && Array.isArray(res.data.data)) {
          fetchedOrders = res.data.data;
        }
        this.setState({ orders: fetchedOrders, loading: false });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ loading: false });
      });
  };

  btnStatusClick = (id, status) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .put(
        `https://dingzcomputer.onrender.com/api/orders/${id}/status`,
        { status },
        config,
      )
      .then((res) => {
        if (res.data) {
          Swal.fire("THÀNH CÔNG", `Trạng thái: ${status}`, "success");
          this.apiGetOrders();
          this.setState({ itemSelected: null });
        }
      })
      .catch((err) => {
        const errorMsg =
          err.response?.data?.message || err.message || "Thao tác thất bại!";
        Swal.fire("LỖI TỪ BACKEND", errorMsg, "error");
      });
  };

  getStatusStyles = (status) => {
    switch (status) {
      case "PROCESSING":
        return { bg: "#fff3e0", color: "#f57c00", text: "ĐANG XỬ LÝ" };
      case "SHIPPED":
        return { bg: "#e3f2fd", color: "#0288d1", text: "ĐANG GIAO" };
      case "COMPLETED":
        return { bg: "#e6f4ea", color: "#1e8e3e", text: "HOÀN THÀNH" };
      case "CANCELLED":
        return { bg: "#ffebee", color: "#d32f2f", text: "ĐÃ HỦY" };
      default:
        return { bg: "#f5f5f5", color: "#757575", text: "CHỜ DUYỆT" };
    }
  };

  render() {
    const { orders, itemSelected, loading } = this.state;
    const hasOrders = orders && orders.length > 0;

    const rows = hasOrders
      ? orders.map((item) => {
          const style = this.getStatusStyles(item.status);
          return (
            <tr
              key={item._id}
              className="datatable"
              onClick={() => this.setState({ itemSelected: item })}
              style={{
                cursor: "pointer",
                backgroundColor:
                  itemSelected?._id === item._id ? "#f0f7ff" : "white",
              }}
            >
              <td style={{ padding: "15px" }}>
                {item._id.substring(item._id.length - 5).toUpperCase()}
              </td>
              <td>{new Date(item.createdAt).toLocaleString("vi-VN")}</td>
              <td>{item.user?.name || "Khách hàng"}</td>

              {/* CỘT PHƯƠNG THỨC THANH TOÁN (MỚI THÊM) */}
              <td>
                <span
                  style={{
                    fontWeight: "600",
                    color:
                      item.paymentMethod === "VietQR" ? "#0d47a1" : "#2e7d32",
                  }}
                >
                  {item.paymentMethod === "VietQR" ? "📱 VietQR" : "💵 COD"}
                </span>
              </td>

              <td style={{ fontWeight: "bold" }}>
                {item.totalPrice.toLocaleString()} VNĐ
              </td>
              <td>
                <span
                  style={{
                    padding: "5px 10px",
                    borderRadius: "15px",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    background: style.bg,
                    color: style.color,
                  }}
                >
                  {style.text}
                </span>
              </td>
            </tr>
          );
        })
      : null;

    return (
      <div
        style={{ padding: "30px", background: "#f9f9f9", minHeight: "100vh" }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#1a1a1a",
            marginBottom: "30px",
            fontWeight: "800",
          }}
        >
          QUẢN LÝ ĐƠN HÀNG
        </h2>
        <div style={{ display: "flex", gap: "30px", alignItems: "flex-start" }}>
          <div
            style={{
              flex: 1.5,
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              overflow: "hidden",
            }}
          >
            <div style={{ maxHeight: "500px", overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead
                  style={{
                    background: "#1a1a1a",
                    color: "#fff",
                    position: "sticky",
                    top: 0,
                  }}
                >
                  <tr>
                    <th style={{ padding: "15px" }}>ID</th>
                    <th>Ngày đặt</th>
                    <th>Khách hàng</th>
                    <th>Thanh toán</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody style={{ textAlign: "center" }}>
                  {hasOrders ? (
                    rows
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        style={{ padding: "30px", color: "#888" }}
                      >
                        {loading
                          ? "Đang tải dữ liệu..."
                          : "Chưa có đơn hàng nào."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {itemSelected && (
            <div
              style={{
                flex: 1,
                background: "#fff",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h3
                style={{
                  borderBottom: "2px solid #eee",
                  paddingBottom: "10px",
                }}
              >
                XỬ LÝ ĐƠN HÀNG
              </h3>
              <p>
                Mã đơn: <strong>{itemSelected._id}</strong>
              </p>

              <div
                style={{
                  padding: "10px",
                  background: "#f5f5f5",
                  borderRadius: "5px",
                  marginBottom: "15px",
                }}
              >
                <strong>Lưu ý: </strong>
                {itemSelected.paymentMethod === "VietQR" ? (
                  <span style={{ color: "#d32f2f" }}>
                    Đây là đơn chuyển khoản. Hãy kiểm tra App ngân hàng trước
                    khi bấm Giao hàng!
                  </span>
                ) : (
                  <span>Đây là đơn COD. Có thể xác nhận và giao ngay.</span>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >
                {itemSelected.status === "PENDING" && (
                  <button
                    onClick={() =>
                      this.btnStatusClick(itemSelected._id, "PROCESSING")
                    }
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "#1e8e3e",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    XÁC NHẬN ĐƠN (COD)
                  </button>
                )}

                {itemSelected.status === "PROCESSING" && (
                  <button
                    onClick={() =>
                      this.btnStatusClick(itemSelected._id, "SHIPPED")
                    }
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "#0288d1",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    ĐÃ KIỂM TRA & GIAO HÀNG
                  </button>
                )}

                {itemSelected.status === "SHIPPED" && (
                  <button
                    onClick={() =>
                      this.btnStatusClick(itemSelected._id, "COMPLETED")
                    }
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "#6a1b9a",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    HOÀN THÀNH
                  </button>
                )}

                {itemSelected.status !== "COMPLETED" &&
                  itemSelected.status !== "CANCELLED" && (
                    <button
                      onClick={() => {
                        Swal.fire({
                          title: "Xác nhận hủy?",
                          text: "Hàng sẽ được tự động cộng trả lại vào kho!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#d33",
                          confirmButtonText: "Hủy đơn",
                        }).then((result) => {
                          if (result.isConfirmed)
                            this.btnStatusClick(itemSelected._id, "CANCELLED");
                        });
                      }}
                      style={{
                        flex: 1,
                        padding: "12px",
                        background: "#d32f2f",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      HỦY ĐƠN
                    </button>
                  )}
              </div>
              <div style={{ marginTop: "30px" }}>
                <OrderDetailComponent
                  order={itemSelected}
                  updateOrders={this.apiGetOrders}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default OrderComponent;
