import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainComponent from "./components/MainComponent";
import axios from "axios";

axios.defaults.baseURL =
  "https://99dd6ad2-d9a2-49c6-9433-2fa2f6669151-00-19pg7engwesf5.sisko.replit.dev:8000/api";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <MainComponent />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </BrowserRouter>
    );
  }
}

export default App;
