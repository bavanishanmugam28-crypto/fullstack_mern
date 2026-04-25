import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// ✅ 1. Import the new MongoDB Async actions
import {
  removeFromWishlistAsync,
  fetchWishlistAsync,
} from "../features/wishlist/wishlistSlice";
import { addToCartAsync } from "../features/cart/cartSlice";
import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  HeartCrack,
} from "lucide-react";

function Wishlist() {
  const dispatch = useDispatch();

  // ✅ Grab wishlist items and auth status from Redux
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // ✅ 2. Fetch the latest wishlist data from MongoDB when the page loads
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchWishlistAsync());
    }
  }, [dispatch, isLoggedIn]);

  // ✅ 3. Helper to reliably get the ID whether it's flat or populated from MongoDB
  const getId = (item) => item.productId?._id || item._id || item.id;

  return (
    <div className="container mt-5 pt-4 mb-5">
      {/* Header */}
      <div className="d-flex align-items-center gap-2 mb-4">
        <Heart
          size={28}
          className="text-danger fill-danger"
          strokeWidth={2.5}
        />
        <h2 className="mb-0 fw-bold text-dark">My Wishlist</h2>
        {wishlist.length > 0 && (
          <span className="badge bg-primary bg-opacity-10 text-primary ms-2 rounded-pill fs-6 px-3">
            {wishlist.length} Items
          </span>
        )}
      </div>

      {wishlist.length === 0 ? (
        /* Empty State */
        <div
          className="text-center py-5 bg-light rounded-4 mt-4"
          style={{ border: "2px dashed #dee2e6" }}
        >
          <HeartCrack size={56} className="text-secondary opacity-50 mb-3" />
          <h4 className="fw-bold text-dark mb-2">Your wishlist is empty</h4>
          <p className="text-secondary mb-4">
            Save items you love here to review them later.
          </p>
          <Link
            to="/products"
            className="btn btn-primary px-4 py-2 rounded-pill fw-bold shadow-sm"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <>
          {/* Wishlist Grid */}
          <div className="row g-4">
            {wishlist.map((item) => {
              // 🔥 Uses the safe ID checker
              const itemId = getId(item);

              return (
                <div key={itemId} className="col-sm-6 col-md-4 col-lg-3 d-flex">
                  <div className="card h-100 shadow-sm border-0 rounded-4 w-100 overflow-hidden transition-all hover-shadow">
                    {/* Image & Price Badge */}
                    <div className="position-relative">
                      <img
                        // Support both flat and populated structures
                        src={item.image || item.productId?.image}
                        className="card-img-top"
                        alt={item.name || item.productId?.name}
                        style={{ height: "220px", objectFit: "cover" }}
                      />
                      <div className="position-absolute top-0 end-0 m-2 badge bg-white text-primary shadow-sm border border-primary border-opacity-10 py-2 px-3 fs-6 rounded-pill">
                        ₹{item.price || item.productId?.price}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="card-body d-flex flex-column p-3">
                      <h6
                        className="fw-bold text-dark mb-1 text-truncate"
                        title={item.name || item.productId?.name}
                      >
                        {item.name || item.productId?.name}
                      </h6>
                      <p className="text-muted small mb-3 text-truncate">
                        {item.category || item.productId?.category}
                      </p>

                      {/* Action Buttons */}
                      <div className="mt-auto d-flex gap-2">
                        <button
                          className="btn btn-primary flex-grow-1 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm rounded-3"
                          onClick={() => {
                            // ✅ 4. Send the async actions to MongoDB
                            dispatch(addToCartAsync(item));
                            dispatch(removeFromWishlistAsync(itemId));
                          }}
                        >
                          <ShoppingCart size={16} /> Add to Cart
                        </button>

                        <button
                          className="btn py-2 px-3 d-flex align-items-center justify-content-center rounded-3 border-danger border-opacity-25 bg-danger bg-opacity-10 text-danger transition-all"
                          onClick={() =>
                            dispatch(removeFromWishlistAsync(itemId))
                          }
                          title="Remove from Wishlist"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Shopping Footer */}
          <div className="text-center mt-5">
            <Link
              to="/products"
              className="btn btn-outline-primary rounded-pill px-4 py-2 fw-bold d-inline-flex align-items-center gap-2"
            >
              <ArrowLeft size={18} /> Continue Shopping
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Wishlist;
