const express = require("express");
const router = express.Router();
const { addOrderItems } = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");
const Order = require("../models/Order");

router.post("/", protect, addOrderItems);

router.get("/mine", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email phone")
      .sort({ createdAt: -1 })
      .lean();

    const fixedOrders = orders.map((order) => ({
      ...order,
      status: order.status || "PENDING",
      user: order.user ? order.user : { name: "Khách vãng lai" },
    }));

    res.json(fixedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/status/:id", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: status },

      { returnDocument: "after" },
    );
    if (updatedOrder) {
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
