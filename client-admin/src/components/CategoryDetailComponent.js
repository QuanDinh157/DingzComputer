import React, { Component } from "react";
import axios from "axios";

class CategoryDetailComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtID: "",
      txtName: "",
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item && this.props.item) {
      this.setState({
        txtID: this.props.item._id,
        txtName: this.props.item.name,
      });
    }
  }

  btnAddTaskClick = (e) => {
    e.preventDefault();
    const { txtName } = this.state;
    if (txtName) {
      axios
        .post("https://dingzcomputer.onrender.com/api/categories", {
          name: txtName,
        })
        .then((res) => {
          alert("Thêm danh mục thành công!");
          this.btnResetClick(e);
          this.props.updateCategories();
        })
        .catch((err) => alert(err.response?.data?.message || "Lỗi khi thêm"));
    } else {
      alert("Vui lòng nhập tên danh mục");
    }
  };

  btnUpdateClick = (e) => {
    e.preventDefault();
    const { txtID, txtName } = this.state;
    if (txtID && txtName) {
      axios
        .put(`https://dingzcomputer.onrender.com/api/categories/${txtID}`, {
          name: txtName,
        })
        .then((res) => {
          alert("Cập nhật thành công");
          this.props.updateCategories();
        })
        .catch((err) => alert("Lỗi khi cập nhật"));
    }
  };

  btnDeleteClick = (e) => {
    e.preventDefault();
    if (window.confirm("Bạn có chắc chắn muốn xóa không?")) {
      axios
        .delete(
          `https://dingzcomputer.onrender.com/api/categories/${this.state.txtID}`,
        )
        .then((res) => {
          alert("Đã xóa");
          this.btnResetClick(e);
          this.props.updateCategories();
        })
        .catch((err) => alert("Lỗi khi xóa"));
    }
  };

  btnResetClick = (e) => {
    e.preventDefault();
    this.setState({ txtID: "", txtName: "" });
  };

  render() {
    const inputStyle = {
      width: "100%",
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      boxSizing: "border-box",
      marginTop: "5px",
    };

    const btnStyle = {
      padding: "10px 20px",
      border: "none",
      borderRadius: "4px",
      fontWeight: "bold",
      cursor: "pointer",
      flex: 1,
    };

    return (
      <div
        style={{
          padding: "25px",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h3
          style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}
        >
          CHI TIẾT DANH MỤC
        </h3>
        <form>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontSize: "0.9rem", color: "#666" }}>
              MÃ ID (Tự động):
            </label>
            <input
              type="text"
              value={this.state.txtID}
              readOnly
              style={{
                ...inputStyle,
                backgroundColor: "#f4f4f4",
                color: "#888",
              }}
            />
          </div>
          <div style={{ marginBottom: "25px" }}>
            <label style={{ fontSize: "0.9rem", color: "#666" }}>
              TÊN DANH MỤC:
            </label>
            <input
              type="text"
              value={this.state.txtName}
              onChange={(e) => this.setState({ txtName: e.target.value })}
              placeholder="Nhập tên loại linh kiện..."
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {!this.state.txtID ? (
              <button
                onClick={this.btnAddTaskClick}
                style={{ ...btnStyle, background: "#2e7d32", color: "#fff" }}
              >
                THÊM MỚI
              </button>
            ) : (
              <>
                <button
                  onClick={this.btnUpdateClick}
                  style={{ ...btnStyle, background: "#1976d2", color: "#fff" }}
                >
                  CẬP NHẬT
                </button>
                <button
                  onClick={this.btnDeleteClick}
                  style={{ ...btnStyle, background: "#d32f2f", color: "#fff" }}
                >
                  XÓA
                </button>
              </>
            )}
            <button
              onClick={this.btnResetClick}
              style={{ ...btnStyle, background: "#9e9e9e", color: "#fff" }}
            >
              LÀM MỚI
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default CategoryDetailComponent;
