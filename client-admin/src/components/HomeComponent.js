import React, { Component } from "react";
import axios from "axios";

class HomeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countCategories: 0,
      countProducts: 0,
      countOrders: 0,
    };
  }

  componentDidMount() {
    this.apiGetStatistics();
  }

  apiGetStatistics() {
    const token = localStorage.getItem("token");

    if (!token) return;

    const config = { headers: { Authorization: `Bearer ${token}` } };

    axios
      .get("https://dingzcomputer.onrender.com/api/categories", config)
      .then((res) => {
        this.setState({ countCategories: res.data.length });
      })
      .catch((err) => console.log(err));

    axios
      .get("https://dingzcomputer.onrender.com/api/products", config)
      .then((res) => {
        this.setState({ countProducts: res.data.length });
      })
      .catch((err) => console.log(err));

    axios
      .get("https://dingzcomputer.onrender.com/api/orders", config)
      .then((res) => {
        const pendingOrders = res.data.filter(
          (order) => order.status === "PENDING" || order.status === "Pending",
        );
        this.setState({ countOrders: pendingOrders.length });
      })
      .catch((err) => console.log(err));
  }

  render() {
    const boxStyle = {
      flex: 1,
      padding: "30px",
      background: "#fff",
      border: "1px solid #ddd",
      borderRadius: "4px",
      textAlign: "center",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    };

    const labelStyle = {
      fontSize: "0.9rem",
      color: "#666",
      marginBottom: "10px",
      display: "block",
    };

    const numberStyle = {
      fontSize: "2rem",
      fontWeight: "bold",
      color: "#1a1a1a",
    };

    return (
      <div style={{ padding: "30px" }}>
        <h2 style={{ marginBottom: "30px", fontWeight: "500" }}>
          HỆ THỐNG QUẢN TRỊ DINGZ COMPUTER
        </h2>

        <div style={{ display: "flex", gap: "20px", marginBottom: "40px" }}>
          <div style={boxStyle}>
            <span style={labelStyle}>DANH MỤC LINH KIỆN</span>
            <div style={numberStyle}>{this.state.countCategories}</div>
          </div>

          <div style={boxStyle}>
            <span style={labelStyle}>TỔNG SẢN PHẨM TRONG KHO</span>
            <div style={numberStyle}>{this.state.countProducts}</div>
          </div>

          <div style={boxStyle}>
            <span style={labelStyle}>ĐƠN HÀNG CHỜ XỬ LÝ</span>
            <div style={numberStyle}>{this.state.countOrders}</div>
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "30px",
            border: "1px solid #ddd",
          }}
        >
          <h4 style={{ marginTop: 0 }}>Thông báo hệ thống</h4>
          <p style={{ color: "#444", fontSize: "0.95rem" }}>
            Chào mừng đến với hệ thống quản trị. Bạn đang có{" "}
            <b>{this.state.countOrders}</b> đơn hàng chờ xử lý.
          </p>
        </div>
      </div>
    );
  }
}

export default HomeComponent;
