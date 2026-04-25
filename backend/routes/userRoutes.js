const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Extract the protect middleware for easy use
const { protect } = userController;

// ==========================================
// 🔑 AUTHENTICATION ROUTES
// ==========================================
router.post("/auth/signup", userController.signup);
router.post("/auth/login", userController.login);

// ==========================================
// 👤 PROFILE & ORDERS
// ==========================================
router.get("/profile", protect, userController.getUserProfile);
router.put("/profile", protect, userController.updateUserProfile); // 👈 The "Save" Route
router.get("/orders", protect, userController.getUserOrders);
router.post("/place-order", protect, userController.placeOrder);

// ==========================================
// 🛒 CART ROUTES
// ==========================================
router.get("/cart", protect, userController.getCart);
router.post("/cart/add", protect, userController.addToCart);
router.post("/cart/decrease", protect, userController.decreaseCartQuantity);
router.delete("/cart/clear", protect, userController.clearCart);
router.delete(
  "/cart/remove/:productId",
  protect,
  userController.removeFromCart,
);

// ==========================================
// ❤️ WISHLIST ROUTES
// ==========================================
router.get("/wishlist", protect, userController.getWishlist);
router.post("/wishlist/add", protect, userController.addToWishlist);
router.delete("/wishlist/clear", protect, userController.clearWishlist);
router.delete(
  "/wishlist/remove/:productId",
  protect,
  userController.removeFromWishlist,
);

module.exports = router;
