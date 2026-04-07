import React, { Component } from "react";
import axios from "axios";
import ProductDetailComponent from "./ProductDetailComponent";

class ProductComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      categories: [],
      itemSelected: null,
      txtKeyword: "",
      selCategory: "all",
    };
  }

  componentDidMount() {
    this.apiGetCategories();
    this.apiGetProducts();
  }

  apiGetCategories = () => {
    axios.get("http://localhost:5000/api/categories").then((res) => {
      this.setState({ categories: res.data });
    });
  };

  // Hàm lấy sản phẩm có kèm tham số tìm kiếm
  apiGetProducts = () => {
    const { txtKeyword, selCategory } = this.state;
    axios
      .get(
        `http://localhost:5000/api/products?keyword=${txtKeyword}&categoryId=${selCategory}`,
      )
      .then((res) => {
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
    const prods = this.state.products.map((item) => (
      <tr
        key={item._id}
        className="datatable"
        onClick={() => this.setState({ itemSelected: item })}
        style={{ cursor: "pointer" }}
      >
        <td>{item._id.substring(item._id.length - 5)}</td>{" "}
        {/* Chỉ hiện 5 số cuối ID cho gọn */}
        <td>{item.name}</td>
        <td style={{ fontWeight: "bold" }}>{item.price.toLocaleString()}</td>
        <td>{item.brand}</td>
        <td>{item.category?.name}</td>
        <td>
          <img src={item.image} width="60" alt="" />
        </td>
      </tr>
    ));

    return (
      <div style={{ padding: "20px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          QUẢN LÝ KHO LINH KIỆN
        </h2>

        {/* THANH TÌM KIẾM & LỌC */}
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
            }}
          >
            TÌM KIẾM
          </button>
        </div>

        <div style={{ display: "flex", gap: "30px" }}>
          {/* BẢNG DANH SÁCH */}
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
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Giá</th>
                  <th>Hãng</th>
                  <th>Loại</th>
                  <th>Ảnh</th>
                </tr>
              </thead>
              <tbody>{prods}</tbody>
            </table>
          </div>

          {/* FORM CHI TIẾT (BÊN PHẢI) */}
          <div style={{ flex: 1 }}>
            <ProductDetailComponent
              item={this.state.itemSelected}
              categories={this.state.categories} // THÊM DÒNG NÀY: Gửi danh mục xuống cho form nhập
              updateProducts={this.apiGetProducts}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ProductComponent;
