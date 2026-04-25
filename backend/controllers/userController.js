const User = require("../models/User");
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "your_secret_key", {
    expiresIn: "30d",
  });
};

// ==========================================
// 🛡️ AUTH MIDDLEWARE
// ==========================================
exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your_secret_key",
      );
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) return res.status(401).json({ message: "User not found" });
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized" });
    }
  } else {
    res.status(401).json({ message: "No token" });
  }
};

// ==========================================
// 👤 AUTHENTICATION
// ==========================================
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User exists" });
    const newUser = await User.create({ email, password });
    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      token: generateToken(newUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Admin Check
    if (email === "admin@gmail.com" && password === "admin123") {
      let admin = await User.findOneAndUpdate(
        { email },
        { $setOnInsert: { password, role: "admin" } },
        { upsert: true, new: true },
      );
      return res.json({
        _id: admin._id,
        email: admin.email,
        role: "admin",
        token: generateToken(admin._id),
      });
    }
    const user = await User.findOne({ email, password });
    if (user) {
      res.json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 🛒 CART LOGIC (Atomic Updates)
// ==========================================
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.productId");
    res.json({ cart: user?.cart || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // 1. Try to increment if item exists
    let user = await User.findOneAndUpdate(
      { _id: req.user._id, "cart.productId": productId },
      { $inc: { "cart.$.quantity": Number(quantity) } },
      { new: true },
    ).populate("cart.productId");

    // 2. If not exists, push new item
    if (!user) {
      user = await User.findByIdAndUpdate(
        req.user._id,
        { $push: { cart: { productId, quantity: Number(quantity) } } },
        { new: true },
      ).populate("cart.productId");
    }
    res.json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.decreaseCartQuantity = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findOneAndUpdate(
      {
        _id: req.user._id,
        "cart.productId": productId,
        "cart.quantity": { $gt: 1 },
      },
      { $inc: { "cart.$.quantity": -1 } },
      { new: true },
    ).populate("cart.productId");

    // If quantity was 1, we pull (remove) it
    if (!user) {
      const updated = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { cart: { productId } } },
        { new: true },
      ).populate("cart.productId");
      return res.json({ cart: updated.cart });
    }
    res.json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { cart: { productId: req.params.productId } } },
      { new: true },
    ).populate("cart.productId");
    res.json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// ❤️ WISHLIST LOGIC
// ==========================================
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.json({ wishlist: user?.wishlist || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { wishlist: req.body.productId } }, // $addToSet prevents duplicates
      { new: true },
    ).populate("wishlist");
    res.json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { wishlist: req.params.productId } },
      { new: true },
    ).populate("wishlist");
    res.json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 👤 PROFILE & ORDERS (Fixed for Old Users)
// ==========================================
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { name, age, gender } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { name, age: age === "" ? null : Number(age), gender } },
      { new: true, runValidators: false }, // Bypasses old data conflicts
    ).select("-password");
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("orders");
    res.json({ orders: user?.orders || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const { cartItems, totalAmount } = req.body;
    const newOrder = {
      orderId: "MAG-" + Date.now(),
      items: cartItems,
      totalAmount,
      date: new Date(),
    };
    await User.findByIdAndUpdate(req.user._id, {
      $push: { orders: { $each: [newOrder], $position: 0 } },
      $set: { cart: [] },
    });
    res.status(201).json({ message: "Success", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 🧹 CLEANUP LOGIC
// ==========================================
exports.clearCart = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { cart: [] } },
      { new: true },
    );
    res.json({ cart: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.clearWishlist = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      { $set: { wishlist: [] } },
      { new: true },
    );
    res.json({ wishlist: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const { cartItems, totalAmount, paymentMethod, shippingAddress } = req.body;

    const newOrder = {
      orderId: "MAG-" + Date.now(),
      items: cartItems,
      totalAmount,
      // Logic: Use provided method, or default to "Online" only if absolutely empty
      paymentMethod: paymentMethod || "Online Payment",
      status: "Processing",
      shippingAddress: shippingAddress || "Address not provided",
      date: new Date(),
    };

    await User.findByIdAndUpdate(req.user._id, {
      $push: { orders: { $each: [newOrder], $position: 0 } },
      $set: { cart: [] },
    });

    res.status(201).json({ message: "Success", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
