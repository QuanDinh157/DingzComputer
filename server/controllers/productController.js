const Product = require("../models/Product");

const createProduct = async (req, res) => {
  try {
    const { name, image, brand, category, description, price, countInStock } =
      req.body;

    const product = await Product.create({
      name,
      image,
      brand,
      category,
      description,
      price,
      countInStock,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const { keyword, category, brand, minPrice, maxPrice, sort } = req.query;

    let query = {};

    if (keyword) {
      query.name = { $regex: keyword, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (brand) {
      query.brand = { $regex: new RegExp(`^${brand}$`, "i") };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let mongooseQuery = Product.find(query).populate("category", "name");

    if (sort) {
      const sortOrder = sort === "asc" ? 1 : -1;
      mongooseQuery = mongooseQuery.sort({ price: sortOrder });
    } else {
      mongooseQuery = mongooseQuery.sort({ createdAt: -1 });
    }

    const products = await mongooseQuery;

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNewProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(8);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name",
    );
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Không tìm thấy sản phẩm này!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server: " + error.message });
  }
};

const getAllBrands = async (req, res) => {
  try {
    const rawBrands = await Product.distinct("brand");

    const formattedBrands = [
      ...new Set(
        rawBrands.map((b) =>
          b ? b.charAt(0).toUpperCase() + b.slice(1).toLowerCase() : "",
        ),
      ),
    ].filter(Boolean);

    res.status(200).json(formattedBrands);
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server: " + error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getNewProducts,
  getProductById,
  getAllBrands,
};
