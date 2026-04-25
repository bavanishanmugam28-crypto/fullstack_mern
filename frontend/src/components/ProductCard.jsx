import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addToCartAsync } from "../features/cart/cartSlice";
import {
  addToWishlistAsync,
  removeFromWishlistAsync,
} from "../features/wishlist/wishlistSlice";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🆔 Extract the ID (Handles MongoDB _id or standard id)
  const productId = product?._id || product?.id;

  // 🔐 Auth & Global State
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.cart || []);
  const wishlistItems = useSelector((state) => state.wishlist?.wishlist || []);

  // 👥 Role & Auth Checks
  const isGuestOrLoggedOut = !isLoggedIn || user?.role === "guest";
  const isAdmin = user?.email === "admin@gmail.com";

  // 🛒 CART LOGIC: Check if item is in cart
  const cartItem = cartItems.find((item) => {
    const idInCart = item.productId?._id || item.productId || item._id;
    return idInCart === productId;
  });
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  // ❤️ WISHLIST LOGIC: Check if item is wishlisted
  // This version handles populated and non-populated MongoDB objects
  const isWishlisted = wishlistItems.some((item) => {
    return (
      item._id === productId ||
      item.productId === productId ||
      (item.productId && item.productId._id === productId)
    );
  });

  // 🛡️ Protected Action Wrapper (Login Guard)
  const handleProtectedAction = (e, actionType, actionDispatch) => {
    e.preventDefault();
    e.stopPropagation();

    if (isGuestOrLoggedOut) {
      alert(`Please login to add items to your ${actionType}`);
      navigate("/login");
      return;
    }

    if (isAdmin) {
      alert("Admin accounts cannot perform this action.");
      return;
    }

    actionDispatch();
  };

  const toggleWishlist = (e) => {
    handleProtectedAction(e, "Wishlist", () => {
      if (isWishlisted) {
        dispatch(removeFromWishlistAsync(productId));
      } else {
        dispatch(addToWishlistAsync(product));
      }
    });
  };

  return (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden transition-all hover-shadow">
        {/* 🖼️ Product Image */}
        <Link to={`/product/${productId}`}>
          <div
            className="bg-light d-flex align-items-center justify-content-center"
            style={{ height: "200px", position: "relative" }}
          >
            <img
              src={product?.image || "https://via.placeholder.com/150"}
              className="img-fluid p-3"
              alt={product?.name}
              style={{ maxHeight: "100%", objectFit: "contain" }}
            />
          </div>
        </Link>

        <div className="card-body text-center d-flex flex-column p-3">
          {/* 🏷️ Product Name */}
          <Link
            to={`/product/${productId}`}
            className="text-decoration-none text-dark"
          >
            <h6 className="card-title fw-bold text-truncate mb-1">
              {product?.name}
            </h6>
          </Link>

          {/* ⭐ Rating */}
          <div className="mb-2">
            <small className="text-warning fw-bold">
              ★ {product?.rating?.rate || "0.0"}
            </small>
            <small className="text-muted ms-1">
              ({product?.rating?.count || 0})
            </small>
          </div>

          {/* 💰 Price */}
          <p className="text-primary fw-bolder fs-5 mb-3">₹{product?.price}</p>

          <div className="mt-auto pt-2">
            {/* 🛒 Add to Cart Button */}
            <button
              className={`btn ${cartQuantity > 0 ? "btn-success" : "btn-primary"} btn-sm w-100 mb-2 py-2 fw-bold shadow-sm`}
              onClick={(e) =>
                handleProtectedAction(e, "Cart", () =>
                  dispatch(addToCartAsync(product)),
                )
              }
            >
              {cartQuantity > 0 ? `Added (${cartQuantity})` : "Add to Cart"}
            </button>

            {/* ❤️ Wishlist Button (Toggle Logic) */}
            <button
              className={`btn ${isWishlisted ? "btn-danger" : "btn-outline-danger"} btn-sm w-100 py-2 fw-bold`}
              onClick={toggleWishlist}
            >
              {isWishlisted ? "❤ Wishlisted" : "❤ Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
