import React, { Component } from "react";
import axios from "axios";

class CustomerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      orders: [],
      customer: null,
    };
  }

  componentDidMount() {
    this.apiGetCustomers();
  }

  apiGetCustomers() {
    const token = localStorage.getItem("token"); // Đổi sang xài localStorage
    const config = { headers: { "x-access-token": token } };
    axios
      .get("http://127.0.0.1:5000/api/admin/customers", config)
      .then((res) => {
        this.setState({ customers: res.data });
      })
      .catch((err) => console.log(err.message));
  }

  trCustomerClick(item) {
    this.setState({ customer: item });
    this.apiGetOrdersByCustID(item._id);
  }

  apiGetOrdersByCustID(cid) {
    const token = localStorage.getItem("token"); // Đổi sang xài localStorage
    const config = { headers: { "x-access-token": token } };
    axios
      .get("http://127.0.0.1:5000/api/admin/orders/customer/" + cid, config)
      .then((res) => {
        this.setState({ orders: res.data });
      })
      .catch((err) => console.log(err.message));
  }

  render() {
    const customers = this.state.customers.map((item) => {
      return (
        <tr
          key={item._id}
          onClick={() => this.trCustomerClick(item)}
          style={{ cursor: "pointer", borderBottom: "1px solid #eee", textAlign: "center", height: "50px" }}
        >
          <td>{item._id.substring(0, 5)}...</td>
          <td style={{ fontWeight: "bold" }}>{item.name}</td>
          <td>{item.phone}</td>
          <td>{item.email}</td>
          <td>
            <span style={{ color: item.active === 0 ? "red" : "green", fontWeight: "bold" }}>
              {item.active === 0 ? "BỊ KHÓA" : "HOẠT ĐỘNG"}
            </span>
          </td>
        </tr>
      );
    });

    const orders = this.state.orders.map((item) => {
      return (
        <tr key={item._id} style={{ borderBottom: "1px solid #eee", textAlign: "center", height: "50px" }}>
          <td>{item._id.substring(0, 5)}</td>
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td>{item.customer.name}</td>
          <td style={{ fontWeight: "bold" }}>{item.total.toLocaleString("vi-VN")} VNĐ</td>
          <td>{item.status}</td>
        </tr>
      );
    });

    return (
      <div style={{ padding: "20px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px", textTransform: "uppercase" }}>
          QUẢN LÝ KHÁCH HÀNG
        </h2>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "40px", backgroundColor: "#fff", boxShadow: "0 0 10px rgba(0,0,0,0.1)", borderRadius: "8px", overflow: "hidden" }}>
          <thead style={{ backgroundColor: "#222", color: "#fff", height: "50px" }}>
            <tr>
              <th>ID</th>
              <th>Tên khách hàng</th>
              <th>Điện thoại</th>
              <th>Email</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? customers : <tr><td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>Không có dữ liệu khách hàng</td></tr>}
          </tbody>
        </table>

        {this.state.customer ? (
          <div>
            <h3 style={{ borderLeft: "5px solid #d32f2f", paddingLeft: "10px", marginBottom: "15px" }}>
              ĐƠN HÀNG CỦA: <span style={{ color: "#d32f2f" }}>{this.state.customer.name}</span>
            </h3>
            <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", boxShadow: "0 0 10px rgba(0,0,0,0.1)", borderRadius: "8px", overflow: "hidden" }}>
              <thead style={{ backgroundColor: "#f4f4f4", color: "#333", height: "50px" }}>
                <tr>
                  <th>Mã đơn</th>
                  <th>Ngày đặt</th>
                  <th>Khách hàng</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? orders : <tr><td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>Khách hàng này chưa có đơn hàng nào</td></tr>}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    );
  }
}

export default CustomerComponent;