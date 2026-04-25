const Product = require("../models/Product");

// 📥 GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category) query.category = { $regex: category, $options: "i" };
    if (search) query.name = { $regex: search, $options: "i" };

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔍 GET SINGLE PRODUCT (Fixes the Line 12 Crash)
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Invalid Product ID" });
  }
};

// ➕ CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      rating: req.body.rating || { rate: 0, count: 0 },
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✏️ UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    // 1. Create a copy of the request body
    const updateData = { ...req.body };
    
    // 2. STRIP THE _id! MongoDB will throw an error if you try to "update" an immutable _id
    delete updateData._id;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData, // Pass the cleaned data
      { new: true, runValidators: true } // ✅ Use standard Mongoose syntax + run schema validations
    );

    // 3. Safety check in case the ID was valid but deleted
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    // If it fails, log it to your backend console so you can see exactly why
    console.error("UPDATE ERROR:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// ❌ DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
