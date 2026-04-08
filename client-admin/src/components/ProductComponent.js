import React, { Component } from "react";
import axios from "axios";
import ProductDetailComponent from "./ProductDetailComponent";

class ProductComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      categories: [],
      brands: [],
      itemSelected: null,
      txtKeyword: "",
      selCategory: "all",
      selBrand: "all",
    };
  }

  componentDidMount() {
    this.apiGetCategories();
    this.apiGetBrands();
    this.apiGetProducts();
  }

  apiGetCategories = () => {
    axios
      .get("https://dingzcomputer.onrender.com/api/categories")
      .then((res) => {
        this.setState({ categories: res.data });
      });
  };

  apiGetBrands = () => {
    axios
      .get("https://dingzcomputer.onrender.com/api/products/brands")
      .then((res) => {
        this.setState({ brands: res.data });
      });
  };

  apiGetProducts = () => {
    const { txtKeyword, selCategory, selBrand } = this.state;
    let url = "https://dingzcomputer.onrender.com/api/products?";
    const params = new URLSearchParams();

    if (txtKeyword) params.append("keyword", txtKeyword);
    if (selCategory !== "all") params.append("category", selCategory);
    if (selBrand !== "all") params.append("brand", selBrand);

    axios.get(url + params.toString()).then((res) => {
      this.setState({ products: res.data });
    });
  };

  btnSearchClick = (e) => {
    e.preventDefault();
    this.apiGetProducts();
  };

  render() {
    const cats = this.state.categories.map((c) => (
      <option key={c._id} value={c._id}>
        {c.name}
      </option>
    ));

    const brds = this.state.brands.map((b, index) => (
      <option key={index} value={b}>
        {b}
      </option>
    ));

    const prods = this.state.products.map((item) => (
      <tr
        key={item._id}
        className="datatable"
        onClick={() => this.setState({ itemSelected: item })}
        style={{ cursor: "pointer", textAlign: "center" }}
      >
        <td style={{ padding: "8px" }}>
          {item._id.substring(item._id.length - 5)}
        </td>
        <td style={{ padding: "8px", textAlign: "left" }}>{item.name}</td>
        <td style={{ padding: "8px", fontWeight: "bold" }}>
          {item.price.toLocaleString("vi-VN")}đ
        </td>
        <td style={{ padding: "8px" }}>{item.brand}</td>
        <td style={{ padding: "8px" }}>{item.category?.name}</td>
        <td style={{ padding: "8px" }}>
          <img
            src={item.image}
            width="60"
            alt=""
            style={{ objectFit: "cover" }}
          />
        </td>
      </tr>
    ));

    return (
      <div style={{ padding: "20px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          QUẢN LÝ KHO LINH KIỆN
        </h2>

        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            gap: "10px",
            background: "#fff",
            padding: "15px",
            border: "1px solid #ddd",
          }}
        >
          <input
            placeholder="Tìm tên linh kiện..."
            value={this.state.txtKeyword}
            onChange={(e) => this.setState({ txtKeyword: e.target.value })}
            style={{ padding: "8px", flex: 1 }}
          />
          <select
            value={this.state.selBrand}
            onChange={(e) => this.setState({ selBrand: e.target.value })}
            style={{ padding: "8px" }}
          >
            <option value="all">Tất cả hãng</option>
            {brds}
          </select>
          <select
            value={this.state.selCategory}
            onChange={(e) => this.setState({ selCategory: e.target.value })}
            style={{ padding: "8px" }}
          >
            <option value="all">Tất cả danh mục</option>
            {cats}
          </select>
          <button
            onClick={this.btnSearchClick}
            style={{
              padding: "8px 20px",
              background: "#1a1a1a",
              color: "#fff",
              cursor: "pointer",
              border: "none",
            }}
          >
            TÌM KIẾM
          </button>
        </div>

        <div style={{ display: "flex", gap: "30px" }}>
          <div style={{ flex: 1.5, maxHeight: "600px", overflowY: "auto" }}>
            <table
              border="1"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "#fff",
              }}
            >
              <thead style={{ background: "#eee" }}>
                <tr>
                  <th style={{ padding: "10px" }}>ID</th>
                  <th style={{ padding: "10px" }}>Tên</th>
                  <th style={{ padding: "10px" }}>Giá</th>
                  <th style={{ padding: "10px" }}>Hãng</th>
                  <th style={{ padding: "10px" }}>Loại</th>
                  <th style={{ padding: "10px" }}>Ảnh</th>
                </tr>
              </thead>
              <tbody>{prods}</tbody>
            </table>
          </div>

          <div style={{ flex: 1 }}>
            <ProductDetailComponent
              item={this.state.itemSelected}
              categories={this.state.categories}
              brands={this.state.brands}
              updateProducts={this.apiGetProducts}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ProductComponent;
