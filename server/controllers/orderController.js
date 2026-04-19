const Order = require("../models/Order");
const Product = require("../models/Product");
const sendOrderEmail = require("../utils/sendEmail");

const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      totalPrice,
      total,
      paymentMethod,
      email,
      customerName,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng đang trống" });
    }

    for (let i = 0; i < orderItems.length; i++) {
      const item = orderItems[i];
      const productInDb = await Product.findById(item.product);

      if (productInDb.countInStock < item.qty) {
        return res.status(400).json({
          message: `Sản phẩm "${productInDb.name}" chỉ còn ${productInDb.countInStock}. Không đủ hàng!`,
        });
      }
    }

    for (let i = 0; i < orderItems.length; i++) {
      const item = orderItems[i];
      const productInDb = await Product.findById(item.product);

      productInDb.countInStock -= item.qty;
      await productInDb.save();
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
      totalPrice: totalPrice || total || 0,
      status: "PENDING",
    });

    const createdOrder = await order.save();

    if (!paymentMethod || paymentMethod === "COD") {
      sendOrderEmail(
        email || req.user.email,
        createdOrder,
        customerName || req.user.name,
        "new",
      ).catch((err) => console.error("Lỗi gửi mail tạo đơn:", err.message));
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (order) {
      order.status = req.body.status;
      const updatedOrder = await order.save();

      if (req.body.status === "shipping" || req.body.status === "cancelled") {
        const emailKhach = order.user
          ? order.user.email
          : "khachhang@gmail.com";
        const tenKhach = order.user ? order.user.name : "Quý khách";

        sendOrderEmail(
          emailKhach,
          updatedOrder,
          tenKhach,
          req.body.status,
        ).catch((err) =>
          console.error("Lỗi gửi mail trạng thái:", err.message),
        );
      }

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const confirmBankTransfer = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentMethod = "VietQR";
      order.status = "PROCESSING";

      const updatedOrder = await order.save();

      const emailKhach = order.user ? order.user.email : "khachhang@gmail.com";
      const tenKhach = order.user ? order.user.name : "Quý khách";

      sendOrderEmail(emailKhach, updatedOrder, tenKhach, "new").catch((err) =>
        console.error("Lỗi gửi mail xác nhận VietQR:", err.message),
      );

      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addOrderItems, updateOrderStatus, confirmBankTransfer };
