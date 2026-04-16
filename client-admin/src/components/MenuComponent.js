import React, { Component } from "react";
import { Link } from "react-router-dom";

class MenuComponent extends Component {
  lnkLogoutClick = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    localStorage.removeItem("customer");
    window.location.href = "https://dingz-computer.vercel.app/home";
  };

  render() {
    return (
      <div
        className="admin-menu"
        style={{
          background: "#1a1a1a",
          padding: "15px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.5)",
        }}
      >
        <ul
          style={{
            display: "flex",
            listStyle: "none",
            gap: "25px",
            margin: 0,
            alignItems: "center",
          }}
        >
          <li>
            <Link
              to="/admin/home"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              HOME
            </Link>
          </li>
          <li>
            <Link
              to="/admin/category"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              CATEGORY
            </Link>
          </li>
          <li>
            <Link
              to="/admin/product"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              PRODUCT
            </Link>
          </li>
          <li>
            <Link
              to="/admin/order"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              ORDER
            </Link>
          </li>
          <li>
            <Link
              to="/admin/customer"
              style={{
                color: "#f1c40f",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              CUSTOMER
            </Link>
          </li>
          <li style={{ marginLeft: "auto", color: "#61dafb" }}>
            Hello <b>Admin</b> |{" "}
            <Link
              to="#"
              onClick={this.lnkLogoutClick}
              style={{
                color: "#ff4d4d",
                textDecoration: "none",
                fontSize: "0.8rem",
                fontWeight: "bold",
              }}
            >
              Logout
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default MenuComponent;
