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
      .get("http://localhost:5000/api/orders", config)
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
      .put(`http://localhost:5000/api/orders/status/${id}`, { status }, config)
      .then((res) => {
        if (res.data) {
          Swal.fire("THÀNH CÔNG", `Trạng thái: ${status}`, "success");
          this.apiGetOrders();
          this.setState({ itemSelected: null });
        }
      })
      .catch((err) => Swal.fire("LỖI", "Thao tác thất bại!", "error"));
  };

  render() {
    const hasOrders = this.state.orders && this.state.orders.length > 0;

    const rows = hasOrders
      ? this.state.orders.map((item) => (
          <tr
            key={item._id}
            className="datatable"
            onClick={() => this.setState({ itemSelected: item })}
            style={{
              cursor: "pointer",
              backgroundColor:
                this.state.itemSelected?._id === item._id ? "#f0f7ff" : "white",
            }}
          >
            <td style={{ padding: "15px" }}>
              {item._id.substring(item._id.length - 5).toUpperCase()}
            </td>
            <td>
              {new Date(item.cdate || item.createdAt).toLocaleString("vi-VN")}
            </td>
            <td>{item.user?.name || item.username || "Khách hàng"}</td>
            <td style={{ fontWeight: "bold" }}>
              {(item.totalPrice || item.total || 0).toLocaleString()} VNĐ
            </td>
            <td>
              <span
                style={{
                  padding: "5px 10px",
                  borderRadius: "15px",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  background:
                    item.status === "APPROVED"
                      ? "#e6f4ea"
                      : item.status === "CANCELED"
                        ? "#ffebee"
                        : "#fff3e0",
                  color:
                    item.status === "APPROVED"
                      ? "#1e8e3e"
                      : item.status === "CANCELED"
                        ? "#d32f2f"
                        : "#f57c00",
                }}
              >
                {!item.status ||
                item.status === "PENDING" ||
                item.status === "Pending"
                  ? "CHỜ DUYỆT"
                  : item.status === "APPROVED"
                    ? "ĐÃ DUYỆT"
                    : "ĐÃ HỦY"}
              </span>
            </td>
          </tr>
        ))
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
                        colSpan="5"
                        style={{ padding: "30px", color: "#888" }}
                      >
                        {this.state.loading
                          ? "Đang tải dữ liệu..."
                          : "Chưa có đơn hàng nào được tìm thấy."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {this.state.itemSelected && (
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
                Mã đơn: <strong>{this.state.itemSelected._id}</strong>
              </p>
              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                {(!this.state.itemSelected.status ||
                  this.state.itemSelected.status === "PENDING" ||
                  this.state.itemSelected.status === "Pending") && (
                  <>
                    <button
                      onClick={() =>
                        this.btnStatusClick(
                          this.state.itemSelected._id,
                          "APPROVED",
                        )
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
                      DUYỆT ĐƠN
                    </button>
                    <button
                      onClick={() =>
                        this.btnStatusClick(
                          this.state.itemSelected._id,
                          "CANCELED",
                        )
                      }
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
                  </>
                )}
              </div>
              <div style={{ marginTop: "30px" }}>
                <OrderDetailComponent
                  order={this.state.itemSelected}
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
