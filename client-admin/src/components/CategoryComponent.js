import React, { Component } from "react";
import axios from "axios";
import CategoryDetailComponent from "./CategoryDetailComponent";

class CategoryComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      itemSelected: null,
    };
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  apiGetCategories = () => {
    axios.get("http://localhost:5000/api/categories").then((res) => {
      this.setState({ categories: res.data });
    });
  };

  trItemClick = (item) => {
    this.setState({ itemSelected: item });
  };

  render() {
    const cats = this.state.categories.map((item) => {
      const isSelected =
        this.state.itemSelected && this.state.itemSelected._id === item._id;
      return (
        <tr
          key={item._id}
          className="datatable"
          onClick={() => this.trItemClick(item)}
          style={{
            cursor: "pointer",
            backgroundColor: isSelected ? "#e3f2fd" : "transparent",
            transition: "background-color 0.2s",
          }}
        >
          <td style={{ textAlign: "center", padding: "10px" }}>
            {item._id.substring(item._id.length - 5)}
          </td>
          <td style={{ padding: "10px" }}>{item.name}</td>
        </tr>
      );
    });

    return (
      <div
        style={{
          display: "flex",
          padding: "30px",
          gap: "50px",
          backgroundColor: "#f9f9f9",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            flex: 1.5,
            background: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              textAlign: "center",
              color: "#333",
              marginBottom: "20px",
              textTransform: "uppercase",
            }}
          >
            Danh sách danh mục
          </h3>
          <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
            <table
              border="1"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #ddd",
              }}
            >
              <thead
                style={{ background: "#f4f4f4", position: "sticky", top: 0 }}
              >
                <tr>
                  <th style={{ padding: "12px" }}>ID</th>
                  <th style={{ padding: "12px" }}>Tên linh kiện</th>
                </tr>
              </thead>
              <tbody>{cats}</tbody>
            </table>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <CategoryDetailComponent
            item={this.state.itemSelected}
            updateCategories={this.apiGetCategories}
          />
        </div>
      </div>
    );
  }
}

export default CategoryComponent;
