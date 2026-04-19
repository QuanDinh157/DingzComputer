import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import axios from "axios";
import Swal from "sweetalert2";
import VietQRPaymentComponent from "./VietQRPaymentComponent";

class CheckoutComponent extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      address: "",
      phone: "",
      city: "TP. Hồ Chí Minh",
      isReady: false,
      createdOrder: null,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      const { user } = this.context;
      if (user) {
        this.setState({
          phone: user.phone || "",
          address: user.address || "",
          isReady: true,
        });
      } else {
        window.location.href = "/login";
      }
    }, 200);
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  btnConfirmOrderClick = (e) => {
    e.preventDefault();
    const { mycart, token, user } = this.context;
    const { address, phone, city } = this.state;

    if (!address.trim() || !phone.trim()) {
      Swal.fire(
        "THÔNG BÁO",
        "Vui lòng hoàn thiện thông tin giao hàng!",
        "warning",
      );
      return;
    }

    const orderData = {
      orderItems: mycart.map((item) => ({
        name: item.product.name,
        qty: item.quantity,
        image: item.product.image,
        price: item.product.price,
        product: item.product._id,
      })),
      shippingAddress: { address, city, phone },
      totalPrice: mycart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      ),
      email: user.email,
      customerName: user.name,
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .post("https://dingzcomputer.onrender.com/api/orders", orderData, config)
      .then((res) => {
        if (res.data) {
          Swal.fire({
            title: "ĐẶT HÀNG THÀNH CÔNG",
            text: "Vui lòng tiến hành thanh toán để hoàn tất đơn hàng!",
            icon: "success",
            confirmButtonColor: "#ed1c24",
          }).then(() => {
            this.context.setMycart([]);
            localStorage.removeItem("mycart");
            this.setState({ createdOrder: res.data });
          });
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.message || err.message;
        Swal.fire("LỖI ĐẶT HÀNG", msg, "error");
      });
  };

  render() {
    const { mycart, user } = this.context;
    const { isReady, createdOrder } = this.state;

    if (!isReady) return <div className="p-loading">ĐANG TẢI...</div>;

    if (createdOrder) {
      return (
        <div className="checkout-page-wrapper">
          <VietQRPaymentComponent order={createdOrder} />
        </div>
      );
    }

    const total = mycart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    return (
      <div className="checkout-page-wrapper">
        <div className="checkout-content-container">
          <h1 className="checkout-main-title">THANH TOÁN ĐƠN HÀNG</h1>
          <div className="checkout-grid">
            <div className="checkout-info-section">
              <h3 className="section-title">1. THÔNG TIN GIAO HÀNG</h3>
              <div className="checkout-form">
                <div className="form-group-item">
                  <label>Họ và tên khách hàng</label>
                  <input
                    type="text"
                    value={user?.name || ""}
                    readOnly
                    className="input-locked"
                  />
                </div>
                <div className="form-group-item">
                  <label>Số điện thoại nhận hàng</label>
                  <input
                    type="text"
                    name="phone"
                    value={this.state.phone}
                    onChange={this.handleInputChange}
                    placeholder="Nhập SĐT..."
                  />
                </div>
                <div className="form-group-item">
                  <label>Địa chỉ nhận hàng chi tiết</label>
                  <textarea
                    name="address"
                    value={this.state.address}
                    onChange={this.handleInputChange}
                    placeholder="Số nhà, tên đường..."
                    rows="4"
                  ></textarea>
                </div>
                <div className="form-group-item">
                  <label>Tỉnh / Thành phố</label>
                  <select
                    name="city"
                    value={this.state.city}
                    onChange={this.handleInputChange}
                    className="checkout-select-custom"
                  >
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="An Giang">An Giang</option>
                    <option value="Bà Rịa - Vũng Tàu">Bà Rịa - Vũng Tàu</option>
                    <option value="Bắc Ninh">Bắc Ninh</option>
                    <option value="Bình Dương">Bình Dương</option>
                    <option value="Bình Định">Bình Định</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Đồng Nai">Đồng Nai</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                    <option value="Khánh Hòa">Khánh Hòa</option>
                    <option value="Lâm Đồng">Lâm Đồng</option>
                    <option value="Long An">Long An</option>
                    <option value="Quảng Ninh">Quảng Ninh</option>
                    <option value="Tây Ninh">Tây Ninh</option>
                    <option value="Thừa Thiên Huế">Thừa Thiên Huế</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="checkout-summary-section">
              <h3 className="section-title">2. CHI TIẾT ĐƠN HÀNG</h3>
              <div className="summary-list">
                {mycart.map((item, index) => (
                  <div key={index} className="summary-product-item">
                    <div className="summary-img-box">
                      <img src={item.product.image} alt="" />
                    </div>
                    <div className="prod-detail">
                      <p className="p-name">{item.product.name}</p>
                      <div className="p-meta">
                        <span className="p-qty">SL: {item.quantity}</span>
                        <span className="p-price">
                          {(
                            item.product.price * item.quantity
                          ).toLocaleString()}
                          ₫
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="final-bill-box">
                <div className="bill-row">
                  <span>Tạm tính</span>
                  <span>{total.toLocaleString()}₫</span>
                </div>
                <div className="bill-row">
                  <span>Vận chuyển</span>
                  <span className="free-ship">Miễn phí</span>
                </div>
                <div className="bill-divider"></div>
                <div className="bill-row total-grand">
                  <span>TỔNG CỘNG</span>
                  <span className="final-val">{total.toLocaleString()}₫</span>
                </div>
                <button
                  className="btn-final-checkout"
                  onClick={this.btnConfirmOrderClick}
                >
                  XÁC NHẬN ĐẶT HÀNG
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CheckoutComponent;
