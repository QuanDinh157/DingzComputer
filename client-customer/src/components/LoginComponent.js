import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import MyContext from "../contexts/MyContext";

class LoginComponent extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: "",
      txtPassword: "",
    };
  }

  btnLoginClick = (e) => {
    e.preventDefault();
    const { txtUsername, txtPassword } = this.state;

    if (txtUsername && txtPassword) {
      const body = { username: txtUsername, password: txtPassword };

      axios
        .post("https://dingzcomputer.onrender.com/api/users/login", body)
        .then((res) => {
          this.handleSuccessLogin(res.data, "customer");
        })
        .catch((errCustomer) => {
          axios
            .post("https://dingzcomputer.onrender.com/api/admin/login", body)
            .then((resAdmin) => {
              this.handleSuccessLogin(resAdmin.data, "admin");
            })
            .catch((errAdmin) => {
              toast.error("Sai tên đăng nhập hoặc mật khẩu!");
            });
        });
    } else {
      toast.warn("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
    }
  };

  handleSuccessLogin = (data, role) => {
    const token = data.token;
    const userData = data.user || data;

    if (token) {
      this.context.setUser(userData);
      this.context.setToken(token);
      localStorage.setItem("customer", JSON.stringify(userData));
      localStorage.setItem("token", token);

      const displayName = userData.name || userData.username || "bạn";
      toast.success(displayName + " đang truy cập hệ thống quản lý!");

      setTimeout(() => {
        if (role === "admin") {
          const currentPort = window.location.port;
          const adminPort = currentPort === "3000" ? "3001" : "3000";
          window.location.href = `http://localhost:${adminPort}/admin/home?token=${token}`;
        } else {
          window.location.href = "/home";
        }
      }, 1000);
    }
  };

  render() {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <h2 className="auth-title">ĐĂNG NHẬP HỆ THỐNG</h2>
          <form onSubmit={this.btnLoginClick}>
            <label className="form-label">TÊN ĐĂNG NHẬP</label>
            <input
              type="text"
              className="form-input"
              value={this.state.txtUsername}
              onChange={(e) => this.setState({ txtUsername: e.target.value })}
              required
            />
            <label className="form-label">MẬT KHẨU</label>
            <input
              type="password"
              className="form-input"
              value={this.state.txtPassword}
              onChange={(e) => this.setState({ txtPassword: e.target.value })}
              required
            />
            <button type="submit" className="btn-primary">
              ĐĂNG NHẬP
            </button>
          </form>
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            Chưa có tài khoản?{" "}
            <Link to="/signup" className="auth-link">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginComponent;
