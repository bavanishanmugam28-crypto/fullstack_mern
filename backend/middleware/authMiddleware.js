const jwt = require("jsonwebtoken");
const User = require("../models/User");
const mongoose = require("mongoose");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "MagizhSecret123",
      );

      // 🛡️ SPECIAL ADMIN BYPASS: If the ID is our hardcoded string
      if (decoded.id === "admin_id") {
        req.user = {
          _id: new mongoose.Types.ObjectId("65f123456789012345678901"),
          email: "admin@gmail.com",
          role: "admin",
        };
        return next();
      }

      // 🔍 STANDARD USER: Check if the ID is a valid MongoDB format before querying
      if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
        return res.status(401).json({ message: "Invalid token format" });
      }

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.error("Token Error:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

const admin = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "admin" || req.user.email === "admin@gmail.com")
  ) {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as an admin" });
  }
};

module.exports = { protect, admin };


//Frontend → Route → Controller → Database → Controller → Response → Frontend
