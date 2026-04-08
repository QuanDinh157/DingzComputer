import React, { Component } from "react";
import { Link } from "react-router-dom";
import MyContext from "../contexts/MyContext";

class MenuComponent extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      txtKeyword: "",
    };
  }

  toggleMenu = () => {
    this.setState({ showMenu: !this.state.showMenu });
  };

  closeMenu = () => {
    this.setState({ showMenu: false });
  };

  btnLogoutClick = () => {
    this.context.setToken("");
    this.context.setUser(null);
    this.context.setMycart([]);
    localStorage.removeItem("customer");
    localStorage.removeItem("token");
    this.closeMenu();
  };

  btnSearchClick = (e) => {
    e.preventDefault();
    if (this.state.txtKeyword.trim()) {
      window.location.href = "/home?keyword=" + this.state.txtKeyword;
    }
  };

  render() {
    const { user, mycart } = this.context;

    const displayName = user ? user.name || user.username || "Khách" : "";

    return (
      <div className="navbar">
        <div className="nav-left">
          <Link to="/home" className="logo" onClick={this.closeMenu}>
            DINGZ COMPUTER
          </Link>
          <Link to="/home" className="nav-link" onClick={this.closeMenu}>
            Sản phẩm mới
          </Link>
        </div>

        <form className="search-form" onSubmit={this.btnSearchClick}>
          <input
            type="search"
            placeholder="Tìm linh kiện, máy tính..."
            className="search-input"
            value={this.state.txtKeyword}
            onChange={(e) => this.setState({ txtKeyword: e.target.value })}
          />
          <button type="submit" className="search-btn"></button>
        </form>

        <div className="nav-right">
          {user ? (
            <div className="user-profile-dropdown">
              <div className="user-info-trigger" onClick={this.toggleMenu}>
                <div className="user-avatar-circle">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className="user-name-text">Chào, {displayName}</span>
                <span style={{ marginLeft: "5px", fontSize: "0.8rem" }}>
                  {this.state.showMenu ? "▲" : "▼"}
                </span>
              </div>

              {this.state.showMenu && (
                <div className="dropdown-content">
                  <Link to="/myprofile" onClick={this.closeMenu}>
                    Hồ sơ cá nhân
                  </Link>
                  <Link to="/myorders" onClick={this.closeMenu}>
                    Đơn hàng của tôi
                  </Link>
                  <div className="dropdown-divider"></div>
                  <Link
                    to="/home"
                    onClick={this.btnLogoutClick}
                    className="logout-link"
                  >
                    Đăng xuất
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="nav-link">
                Đăng nhập
              </Link>
              <Link to="/signup" className="nav-link">
                Đăng ký
              </Link>
            </div>
          )}

          <Link to="/mycart" className="btn-cart" onClick={this.closeMenu}>
            Giỏ hàng ({mycart ? mycart.length : 0})
          </Link>
        </div>
      </div>
    );
  }
}

export default MenuComponent;
