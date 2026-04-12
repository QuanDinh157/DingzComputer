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

    sendOrderEmail(
      email || req.user.email,
      createdOrder._id,
      createdOrder.totalPrice,
      customerName || req.user.name,
    ).catch((err) => console.error("Lỗi gửi mail ngầm:", err.message));

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addOrderItems };
