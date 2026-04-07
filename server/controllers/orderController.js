const Order = require("../models/Order");

const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalPrice, total } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng đang trống" });
    } else {
      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        // Lưu cả 2 trường cho chắc cú, đề phòng React gọi kiểu gì cũng trúng
        totalPrice: totalPrice || total || 0,
        total: total || totalPrice || 0,
        status: "PENDING", // Đảm bảo luôn có trạng thái mặc định là viết hoa
        cdate: new Date().getTime(), // Lưu ngày đặt dạng số để dễ format
      });

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addOrderItems };
