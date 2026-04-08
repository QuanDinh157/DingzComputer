const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-access-token", "token"],
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "16mb" }));
app.use(express.urlencoded({ limit: "16mb", extended: true }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Đã kết nối thành công với MongoDB !"))
  .catch((err) => console.log("Lỗi kết nối cơ sở dữ liệu ! ", err));

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("API của Dingz_computer đang chạy !");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại cổng ${PORT}`);
});
