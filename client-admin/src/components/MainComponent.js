import React, { Component } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MenuComponent from "./MenuComponent";
import HomeComponent from "./HomeComponent";
import CategoryComponent from "./CategoryComponent";
import ProductComponent from "./ProductComponent";
import OrderComponent from "./OrderComponent";
import CustomerComponent from "./CustomerComponent";

class MainComponent extends Component {
  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      window.history.replaceState(null, null, window.location.pathname);
    }
  }

  render() {
    return (
      <div className="body-admin">
        <MenuComponent />
        <Routes>
          <Route
            path="/admin"
            element={<Navigate replace to="/admin/home" />}
          />
          <Route path="/admin/home" element={<HomeComponent />} />
          <Route path="/admin/category" element={<CategoryComponent />} />
          <Route path="/admin/product" element={<ProductComponent />} />
          <Route path="/admin/order" element={<OrderComponent />} />
          <Route path="/admin/customer" element={<CustomerComponent />} />
        </Routes>
      </div>
    );
  }
}

export default MainComponent;
