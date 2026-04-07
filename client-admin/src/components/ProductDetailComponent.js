import React, { Component } from "react";
import axios from "axios";

class ProductDetailComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtID: "",
      txtName: "",
      txtPrice: 0,
      txtBrand: "",
      txtCategory: "",
      txtImage: "",
      txtStock: 0,
      txtDesc: "",
    };
  }

  componentDidMount() {
    // Sửa lại 127.0.0.1 cho đồng bộ an toàn
    axios.get("http://127.0.0.1:5000/api/categories").then((res) => {
      this.setState({ categories: res.data });
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item && this.props.item) {
      this.setState({
        txtID: this.props.item._id,
        txtName: this.props.item.name,
        txtPrice: this.props.item.price,
        txtBrand: this.props.item.brand,
        txtCategory: this.props.item.category?._id || this.props.item.category,
        txtImage: this.props.item.image,
        txtStock: this.props.item.countInStock,
        txtDesc: this.props.item.description,
      });
    }
  }

  captureFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => this.setState({ txtImage: reader.result });
    }
  };

  btnUpdateClick = (e) => {
    e.preventDefault();
    const product = {
      name: this.state.txtName,
      price: Number(this.state.txtPrice),
      brand: this.state.txtBrand,
      category: this.state.txtCategory,
      image: this.state.txtImage,
      countInStock: Number(this.state.txtStock),
      description: this.state.txtDesc,
    };

    if (!product.name || !product.category || !product.brand) {
      alert("Vui lòng điền đủ Tên, Hãng và Loại sản phẩm!");
      return;
    }

    if (this.state.txtID) {
      axios
        .put(`http://127.0.0.1:5000/api/products/${this.state.txtID}`, product)
        .then(() => {
          alert("Cập nhật thành công!");
          this.props.updateProducts();
        });
    } else {
      axios.post(`http://127.0.0.1:5000/api/products`, product).then(() => {
        alert("Thêm mới thành công!");
        this.props.updateProducts();
        this.clearForm();
      });
    }
  };

  btnDeleteClick = (e) => {
    e.preventDefault();
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      if (this.state.txtID) {
        axios
          .delete(`http://127.0.0.1:5000/api/products/${this.state.txtID}`)
          .then(() => {
            alert("Đã xóa thành công!");
            this.props.updateProducts();
            this.clearForm();
          });
      }
    }
  };

  clearForm = () => {
    this.setState({
      txtID: "",
      txtName: "",
      txtPrice: 0,
      txtBrand: "",
      txtCategory: "",
      txtImage: "",
      txtStock: 0,
      txtDesc: "",
    });
  };

  render() {
    const inputStyle = {
      width: "100%",
      padding: "8px",
      marginBottom: "10px",
      boxSizing: "border-box",
      borderRadius: "4px",
      border: "1px solid #ccc",
    };

    // Tạo sẵn mảng các hãng phổ biến (Tránh gõ tay bị sai)
    const brandList = [
      "ASUS",
      "ACER",
      "MSI",
      "DELL",
      "LENOVO",
      "HP",
      "APPLE",
      "INTEL",
      "AMD",
      "GIGABYTE",
      "COLORFUL",
      "KHÁC",
    ];

    return (
      <div
        style={{
          background: "#fff",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <h3
          style={{
            marginTop: 0,
            borderBottom: "2px solid #1a1a1a",
            paddingBottom: "10px",
            color: "#1a1a1a",
            textTransform: "uppercase",
          }}
        >
          {this.state.txtID ? "SỬA SẢN PHẨM" : "THÊM SẢN PHẨM MỚI"}
        </h3>

        {/* XỬ LÝ ẢNH HIỂN THỊ ĐẸP HƠN */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          {this.state.txtImage ? (
            <img
              src={this.state.txtImage}
              width="150"
              height="150"
              alt="Preview"
              style={{
                objectFit: "contain",
                border: "1px solid #eee",
                borderRadius: "8px",
                padding: "5px",
              }}
            />
          ) : (
            <div
              style={{
                width: "150px",
                height: "150px",
                margin: "0 auto",
                background: "#f8f9fa",
                border: "1px dashed #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                color: "#999",
                fontSize: "12px",
              }}
            >
              Chưa có ảnh
            </div>
          )}

          <input
            type="file"
            onChange={this.captureFile}
            style={{
              marginTop: "10px",
              display: "block",
              width: "100%",
              fontSize: "12px",
            }}
          />
        </div>

        <label
          style={{ fontSize: "0.85rem", color: "#555", fontWeight: "bold" }}
        >
          TÊN SẢN PHẨM <span style={{ color: "red" }}>*</span>
        </label>
        <input
          style={inputStyle}
          value={this.state.txtName}
          onChange={(e) => this.setState({ txtName: e.target.value })}
          placeholder="Nhập tên linh kiện/máy tính"
        />

        <div style={{ display: "flex", gap: "15px" }}>
          <div style={{ flex: 1 }}>
            <label
              style={{ fontSize: "0.85rem", color: "#555", fontWeight: "bold" }}
            >
              GIÁ (VNĐ) <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="number"
              style={inputStyle}
              value={this.state.txtPrice}
              onChange={(e) => this.setState({ txtPrice: e.target.value })}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label
              style={{ fontSize: "0.85rem", color: "#555", fontWeight: "bold" }}
            >
              TỒN KHO
            </label>
            <input
              type="number"
              style={inputStyle}
              value={this.state.txtStock}
              onChange={(e) => this.setState({ txtStock: e.target.value })}
            />
          </div>
        </div>

        <label
          style={{ fontSize: "0.85rem", color: "#555", fontWeight: "bold" }}
        >
          HÃNG & DANH MỤC <span style={{ color: "red" }}>*</span>
        </label>
        <div style={{ display: "flex", gap: "15px" }}>
          <select
            style={inputStyle}
            value={this.state.txtBrand}
            onChange={(e) => this.setState({ txtBrand: e.target.value })}
          >
            <option value="">-- Chọn Hãng --</option>
            {brandList.map((brand, index) => (
              <option key={index} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          <select
            style={inputStyle}
            value={this.state.txtCategory}
            onChange={(e) => this.setState({ txtCategory: e.target.value })}
          >
            <option value="">-- Danh Mục --</option>
            {this.state.categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <label
          style={{ fontSize: "0.85rem", color: "#555", fontWeight: "bold" }}
        >
          MÔ TẢ KỸ THUẬT
        </label>
        <textarea
          style={{ ...inputStyle, height: "100px", resize: "vertical" }}
          value={this.state.txtDesc}
          onChange={(e) => this.setState({ txtDesc: e.target.value })}
          placeholder="Nhập thông số kỹ thuật (CPU, RAM, VGA...)"
        />

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button
            onClick={this.btnUpdateClick}
            style={{
              flex: 1,
              padding: "12px",
              background: this.state.txtID ? "#0d47a1" : "#1a1a1a", // Nút xanh nếu cập nhật, đen nếu thêm mới
              color: "#fff",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            {this.state.txtID ? "CẬP NHẬT SẢN PHẨM" : "THÊM MỚI"}
          </button>

          {this.state.txtID && (
            <button
              onClick={this.btnDeleteClick}
              style={{
                flex: 1,
                padding: "12px",
                background: "#d32f2f",
                color: "#fff",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
                borderRadius: "4px",
              }}
            >
              XÓA
            </button>
          )}

          <button
            onClick={this.clearForm}
            style={{
              padding: "12px 20px",
              background: "#e0e0e0",
              color: "#333",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            LÀM MỚI
          </button>
        </div>
      </div>
    );
  }
}

export default ProductDetailComponent;
