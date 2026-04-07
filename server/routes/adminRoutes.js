const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  getCustomers,
  getOrdersByCustomer,
} = require("../controllers/adminController");

router.post("/login", loginAdmin);
router.get("/customers", getCustomers);
router.get("/orders/customer/:cid", getOrdersByCustomer);

module.exports = router;
