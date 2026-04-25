require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// 📂 Import Routes
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

// 🔌 Connect to MongoDB Atlas
connectDB();

const app = express();

// 🛡️ CORS Configuration
// Allows your React/Vite frontend (Port 5173) to talk to this backend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// 📦 Middleware to parse JSON bodies
app.use(express.json());

// 🚀 API Status Health Check
app.get("/", (req, res) => res.send("🚀 Magizh Dairy Backend is running..."));

// 🗺️ Main API Routes
// 1. Product Catalog: /api/products
app.use("/api/products", productRoutes);

// 2. User Auth, Cart, & Personal Orders: /api/users
app.use("/api/users", userRoutes);

// 3. Admin Dashboard & Analytics: /api/admin
// 🟢 This is where your AdminRecentOrders.jsx gets its data from
app.use("/api/admin", adminRoutes);

// ⚙️ Server Port Configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`),
);

// backend/server.js
console.log("Checking JWT Secret...", process.env.JWT_SECRET ? "✅ Found" : "❌ Missing");