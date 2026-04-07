import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

class MyCartComponent extends Component {
  static contextType = MyContext;

  lnkCheckoutClick = () => {
    const { mycart, user } = this.context;

    if (!user) {
      Swal.fire({
        title: "DINGZ COMPUTER",
        text: "Vui lòng đăng nhập để tiến hành đặt hàng!",
        icon: "warning",
        confirmButtonColor: "#ed1c24",
      });
      return;
    }

    if (mycart.length === 0) return;

    window.location.href = "/checkout";
  };

  lnkRemoveClick = (id) => {
    const mycart = [...this.context.mycart];
    const index = mycart.findIndex((item) => item.product._id === id);
    if (index !== -1) {
      mycart.splice(index, 1);
      this.context.setMycart(mycart);
      localStorage.setItem("mycart", JSON.stringify(mycart));
    }
  };

  render() {
    const { mycart, user } = this.context;

    if (!user) {
      return (
        <div className="cart-empty-wrapper">
          <div className="empty-content">
            <img
              src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
              alt="Login Required"
              style={{ width: "150px", opacity: "0.5" }}
            />
            <h2>BẠN CHƯA ĐĂNG NHẬP</h2>
            <p>Vui lòng đăng nhập để xem giỏ hàng và mua linh kiện.</p>
            <Link to="/login" className="btn-back-home">
              ĐĂNG NHẬP NGAY
            </Link>
          </div>
        </div>
      );
    }

    if (mycart.length === 0) {
      return (
        <div className="cart-empty-wrapper">
          <div className="empty-content">
            <img
              src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
              alt="Empty Cart"
              style={{ width: "150px", opacity: "0.5" }}
            />
            <h2>Giỏ hàng của bạn đang trống</h2>
            <p>Hãy chọn linh kiện ưng ý nhất tại Dingz Computer nhé!</p>
            <Link to="/home" className="btn-back-home">
              TIẾP TỤC MUA SẮM
            </Link>
          </div>
        </div>
      );
    }

    let total = 0;
    const items = mycart.map((item, index) => {
      total += item.product.price * item.quantity;
      return (
        <tr key={index} className="cart-item-row">
          <td className="col-product">
            <div className="cart-prod-info">
              <img src={item.product.image} alt={item.product.name} />
              <div className="prod-name-box">
                <Link to={"/product/" + item.product._id}>
                  {item.product.name}
                </Link>
                <span>Bảo hành: 36 Tháng</span>
              </div>
            </div>
          </td>
          <td className="col-price">{item.product.price.toLocaleString()}₫</td>
          <td className="col-qty">
            <div className="qty-control-small">{item.quantity}</div>
          </td>
          <td className="col-subtotal">
            {(item.product.price * item.quantity).toLocaleString()}₫
          </td>
          <td className="col-action">
            <button
              className="btn-remove"
              onClick={() => this.lnkRemoveClick(item.product._id)}
            >
              XÓA
            </button>
          </td>
        </tr>
      );
    });

    return (
      <div className="cart-page-wrapper">
        <h1 className="cart-page-title">
          GIỎ HÀNG CỦA BẠN <span>({mycart.length} sản phẩm)</span>
        </h1>
        <div className="cart-layout">
          <div className="cart-main-list">
            <table className="cart-table-pro">
              <thead>
                <tr>
                  <th>SẢN PHẨM</th>
                  <th>ĐƠN GIÁ</th>
                  <th>SL</th>
                  <th>THÀNH TIỀN</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>{items}</tbody>
            </table>
          </div>
          <div className="cart-sidebar">
            <div className="summary-card">
              <div className="summary-row">
                <span>Tạm tính:</span>
                <span>{total.toLocaleString()}₫</span>
              </div>
              <div className="summary-row">
                <span>Giảm giá:</span>
                <span>0₫</span>
              </div>
              <div className="summary-row total-row">
                <span>TỔNG CỘNG:</span>
                <span className="final-total">{total.toLocaleString()}₫</span>
              </div>
              <p className="vat-note">(Đã bao gồm VAT nếu có)</p>
              <button
                className="btn-checkout-now"
                onClick={this.lnkCheckoutClick}
              >
                TIẾN HÀNH ĐẶT HÀNG
              </button>
              <Link to="/home" className="continue-link">
                ← Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MyCartComponent;
