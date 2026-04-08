import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Cpu, Laptop, MousePointer2, ShoppingCart } from "lucide-react";
import MyContext from "../contexts/MyContext";
import Swal from "sweetalert2";

class HomeComponent extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      categories: [],
      brands: [],
      dynamicRanges: [],
      banners: [
        "/images/Banner_01.png",
        "/images/Banner_02.png",
        "/images/Banner_03.png",
      ],
      currentBannerIndex: 0,
      filterCid: null,
      filterBrand: null,
      filterMinPrice: null,
      filterMaxPrice: null,
      isFiltering: false,
    };
    this.bannerTimer = null;
  }

  componentDidMount() {
    this.apiGetCategories();
    this.apiGetBrands();
    this.apiGetDynamicRanges(null);
    this.startBannerTimer();

    const params = new URLSearchParams(window.location.search);
    const keyword = params.get("keyword");

    if (keyword) {
      this.apiSearchProducts(keyword);
    } else {
      this.apiGetNewProducts();
    }
  }

  componentWillUnmount() {
    if (this.bannerTimer) clearInterval(this.bannerTimer);
  }

  startBannerTimer() {
    this.bannerTimer = setInterval(() => {
      this.setState({
        currentBannerIndex:
          (this.state.currentBannerIndex + 1) % this.state.banners.length,
      });
    }, 4000);
  }

  setCurrentBanner = (index) => {
    this.setState({ currentBannerIndex: index });
    clearInterval(this.bannerTimer);
    this.startBannerTimer();
  };

  apiGetDynamicRanges(cid) {
    let url = "https://dingzcomputer.onrender.com/api/products/dynamic-ranges";
    if (cid) url += `?category=${cid}`;
    axios
      .get(url)
      .then((res) => {
        this.setState({ dynamicRanges: res.data });
      })
      .catch((err) => console.log(err.message));
  }

  apiSearchProducts(keyword) {
    axios
      .get(`https://dingzcomputer.onrender.com/api/products?keyword=${keyword}`)
      .then((res) => {
        this.setState({
          products: res.data,
          isFiltering: true,
        });
        window.scrollTo({ top: 650, behavior: "smooth" });
      })
      .catch((err) => console.log(err.message));
  }

  apiGetNewProducts() {
    axios
      .get("https://dingzcomputer.onrender.com/api/products/new")
      .then((res) =>
        this.setState({
          products: res.data,
          isFiltering: false,
          filterCid: null,
          filterBrand: null,
          filterMinPrice: null,
          filterMaxPrice: null,
        }),
      )
      .catch((err) => console.log(err.message));
  }

  apiGetCategories() {
    axios
      .get("https://dingzcomputer.onrender.com/api/categories")
      .then((res) => this.setState({ categories: res.data }))
      .catch((err) => console.log(err.message));
  }

  apiGetBrands() {
    axios
      .get("https://dingzcomputer.onrender.com/api/products/brands")
      .then((res) => this.setState({ brands: res.data }))
      .catch((err) => console.log(err.message));
  }

  applyFilters = (cid, brand, minPrice, maxPrice) => {
    let url = `https://dingzcomputer.onrender.com/api/products?`;
    const params = new URLSearchParams();

    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get("keyword");
    if (keyword) params.append("keyword", keyword);

    if (cid) params.append("category", cid);
    if (brand) params.append("brand", brand);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);

    if (cid !== this.state.filterCid) {
      this.apiGetDynamicRanges(cid);
    }

    axios
      .get(url + params.toString())
      .then((res) => {
        this.setState({
          products: res.data,
          filterCid: cid,
          filterBrand: brand,
          filterMinPrice: minPrice,
          filterMaxPrice: maxPrice,
          isFiltering: true,
        });
        window.scrollTo({ top: 650, behavior: "smooth" });
      })
      .catch((err) => {
        console.error(err);
        alert("Có lỗi khi lọc dữ liệu!");
      });
  };

  addToCart = (e, item) => {
    e.preventDefault();
    const { user } = this.context;

    if (!user) {
      Swal.fire({
        title: "DINGZ COMPUTER",
        text: "Vui lòng ĐĂNG NHẬP để mua linh kiện!",
        icon: "warning",
        confirmButtonColor: "#ed1c24",
        confirmButtonText: "ĐĂNG NHẬP NGAY",
        showCancelButton: true,
        cancelButtonText: "HỦY",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/login";
        }
      });
      return;
    }

    if (item.countInStock > 0) {
      this.context.add2Cart(item, 1);
      Swal.fire({
        title: "THÀNH CÔNG",
        text: `Đã thêm ${item.name} vào giỏ hàng!`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  render() {
    const {
      banners,
      currentBannerIndex,
      products,
      categories,
      brands,
      dynamicRanges,
      filterCid,
      filterBrand,
      filterMinPrice,
      filterMaxPrice,
      isFiltering,
    } = this.state;

    const isPriceActive = (min, max) =>
      filterMinPrice === min && filterMaxPrice === max;

    return (
      <div className="home-container">
        {!isFiltering && (
          <>
            <div className="slider-container">
              <div
                className="slider-track"
                style={{
                  transform: `translateX(-${currentBannerIndex * 100}%)`,
                }}
              >
                {banners.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt="Banner"
                    className="banner-img"
                  />
                ))}
              </div>
              <div className="slider-dots">
                {banners.map((_, index) => (
                  <div
                    key={index}
                    onClick={() => this.setCurrentBanner(index)}
                    className={`dot ${
                      currentBannerIndex === index ? "active" : ""
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="sub-banners-grid">
              <div
                className="sub-banner-item"
                onClick={() =>
                  this.applyFilters(
                    "69cf7490900d882519ec3a09",
                    null,
                    null,
                    null,
                  )
                }
              >
                <div className="sub-banner-overlay">
                  <Cpu size={32} strokeWidth={1.5} />
                  <h3>LINH KIỆN PC</h3>
                  <span>Nâng cấp sức mạnh</span>
                </div>
                <img src="/images/sub_banners/linh_kien.jpg" alt="CPU" />
              </div>

              <div
                className="sub-banner-item"
                onClick={() =>
                  this.applyFilters(
                    "69d4aaccffea1abc29192eba6",
                    null,
                    null,
                    null,
                  )
                }
              >
                <div className="sub-banner-overlay">
                  <Laptop size={32} strokeWidth={1.5} />
                  <h3>LAPTOP GAMING</h3>
                  <span>Thống trị cuộc chơi</span>
                </div>
                <img src="/images/sub_banners/laptop_banner.jpg" alt="Laptop" />
              </div>

              <div
                className="sub-banner-item"
                onClick={() =>
                  this.applyFilters(
                    "69cf7490900d882519ec3a13",
                    null,
                    null,
                    null,
                  )
                }
              >
                <div className="sub-banner-overlay">
                  <MousePointer2 size={32} strokeWidth={1.5} />
                  <h3>GAMING GEAR</h3>
                  <span>Chính xác tuyệt đối</span>
                </div>
                <img src="/images/sub_banners/gaming_gear.jpg" alt="Gear" />
              </div>
            </div>
          </>
        )}

        <div className="home-content-layout">
          <aside className="home-sidebar">
            <h3 className="sidebar-title">DANH MỤC</h3>
            <ul className="category-list">
              <li>
                <div
                  onClick={() => {
                    window.history.pushState({}, "", "/home");
                    this.apiGetDynamicRanges(null);
                    this.apiGetNewProducts();
                  }}
                  className={`category-item ${
                    !isFiltering ? "active-filter" : ""
                  }`}
                >
                  Tất cả sản phẩm
                </div>
              </li>
              {categories.map((item) => (
                <li key={item._id}>
                  <div
                    onClick={() =>
                      this.applyFilters(item._id, filterBrand, null, null)
                    }
                    className={`category-item ${
                      filterCid === item._id ? "active-filter" : ""
                    }`}
                  >
                    {item.name}
                  </div>
                </li>
              ))}
            </ul>

            <h3 className="sidebar-title" style={{ marginTop: "30px" }}>
              THƯƠNG HIỆU
            </h3>
            <ul className="category-list">
              {brands.map((b, index) => (
                <li key={index}>
                  <div
                    onClick={() =>
                      this.applyFilters(
                        filterCid,
                        b,
                        filterMinPrice,
                        filterMaxPrice,
                      )
                    }
                    className={`category-item ${
                      filterBrand === b ? "active-filter" : ""
                    }`}
                  >
                    {b}
                  </div>
                </li>
              ))}
            </ul>

            {dynamicRanges.length > 0 && (
              <>
                <h3 className="sidebar-title" style={{ marginTop: "30px" }}>
                  MỨC GIÁ
                </h3>
                <ul className="category-list">
                  {dynamicRanges.map((range, index) => (
                    <li key={index}>
                      <div
                        onClick={() =>
                          this.applyFilters(
                            filterCid,
                            filterBrand,
                            range.min,
                            range.max,
                          )
                        }
                        className={`category-item ${isPriceActive(range.min, range.max) ? "active-filter" : ""}`}
                      >
                        {range.label}
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </aside>

          <main className="home-main-content">
            <h2 className="section-title-left">
              {isFiltering ? "KẾT QUẢ TÌM KIẾM & LỌC" : "SẢN PHẨM MỚI NHẤT"}
            </h2>
            <div className="product-grid">
              {products.length > 0 ? (
                products.map((item) => {
                  const currentStock = item.countInStock ?? 0;
                  const isOutOfStock = currentStock <= 0;

                  return (
                    <div key={item._id} className="pro-product-card">
                      <Link
                        to={"/product/" + item._id}
                        className="pro-img-wrapper"
                      >
                        <img src={item.image} alt={item.name} />
                        {item.discount > 0 && (
                          <span className="pro-discount-badge">
                            -{item.discount}%
                          </span>
                        )}
                      </Link>

                      <div className="pro-card-body">
                        <Link
                          to={"/product/" + item._id}
                          className="pro-product-name"
                        >
                          {item.name}
                        </Link>

                        <div className="pro-price-group">
                          <span className="pro-price-new">
                            {item.price.toLocaleString("vi-VN")}đ
                          </span>
                          <span className="pro-price-old">
                            {(item.price * 1.1).toLocaleString("vi-VN")}đ
                          </span>
                        </div>

                        <div className="pro-card-footer">
                          <button
                            className="pro-btn-cart"
                            disabled={isOutOfStock}
                            style={
                              isOutOfStock
                                ? { opacity: 0.5, cursor: "not-allowed" }
                                : {}
                            }
                            onClick={(e) => this.addToCart(e, item)}
                          >
                            <ShoppingCart size={16} strokeWidth={2} />
                            THÊM VÀO GIỎ
                          </button>

                          {!isOutOfStock ? (
                            <span className="pro-status-badge">Còn hàng</span>
                          ) : (
                            <span
                              className="pro-status-badge"
                              style={{
                                backgroundColor: "#fee2e2",
                                color: "#991b1b",
                              }}
                            >
                              Hết hàng
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    width: "100%",
                    padding: "50px",
                  }}
                >
                  Không tìm thấy sản phẩm nào.
                </p>
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default HomeComponent;
