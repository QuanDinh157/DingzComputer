const Admin = require("../models/Admin");
const User = require("../models/User");
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username, password });
    if (admin) {
      res.json({
        success: true,
        message: "Welcome back!",
        token: generateToken(admin._id),
      });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Sai tài khoản hoặc mật khẩu!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi kết nối DB" });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await User.find().select("-password");
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: "Không thể lấy danh sách khách hàng" });
  }
};

const getOrdersByCustomer = async (req, res) => {
  try {
    const orders = await Order.find({ "customer._id": req.params.cid });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Không thể lấy đơn hàng của khách này" });
  }
};

module.exports = { loginAdmin, getCustomers, getOrdersByCustomer };
