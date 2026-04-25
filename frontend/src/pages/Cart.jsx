import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCartAsync,
  addToCartAsync,
  decreaseQuantityAsync,
  fetchCartAsync,
} from "../features/cart/cartSlice";
import { useNavigate, Link } from "react-router-dom";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cart) || [];
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // ✅ Safe ID getter
  const getId = (item) => item?.productId?._id || item?._id || item?.id;

  // ✅ Sync localStorage → MongoDB (FIXED)
  useEffect(() => {
    if (isLoggedIn) {
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];

      const syncCart = async () => {
        if (localCart.length > 0) {
          for (const item of localCart) {
            await dispatch(
              addToCartAsync({
                productId: item.id || item._id,
                quantity: item.quantity || 1,
              }),
            );
          }
          localStorage.removeItem("cart");
        }

        dispatch(fetchCartAsync());
      };

      syncCart();
    }
  }, [dispatch, isLoggedIn]);

  // ✅ Correct total price calculation
  const totalPrice = cartItems.reduce((total, item) => {
    const price = item.price ?? item.productId?.price ?? 0;
    return total + price * item.quantity;
  }, 0);

  // ✅ FIXED increase
  const increaseQty = (item) => {
    dispatch(
      addToCartAsync({
        productId: getId(item),
        quantity: 1,
      }),
    );
  };

  // ✅ FIXED decrease
  const decreaseQty = (item) => {
    const id = getId(item);

    if (item.quantity > 1) {
      dispatch(decreaseQuantityAsync({ productId: id }));
    } else {
      dispatch(removeFromCartAsync({ productId: id }));
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold text-primary">Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-5 border rounded shadow-sm bg-light">
          <h5 className="mb-3">Your cart is empty 🛒</h5>
          <p className="text-muted">
            Looks like you haven't added anything yet.
          </p>

          <Link to="/products" className="btn btn-primary mt-2">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {/* Cart Items */}
          <div className="col-lg-8">
            {cartItems.map((item) => (
              <div key={getId(item)} className="card mb-3 shadow-sm border-0">
                <div className="row g-0 align-items-center">
                  <div className="col-md-3 text-center p-2">
                    <img
                      src={item.image || item.productId?.image}
                      alt={item.name || item.productId?.name}
                      className="img-fluid rounded"
                      style={{ maxHeight: "100px", objectFit: "cover" }}
                    />
                  </div>

                  <div className="col-md-6">
                    <div className="card-body">
                      <h5 className="card-title mb-1">
                        {item.name || item.productId?.name}
                      </h5>
                      <p className="text-muted mb-2">
                        Price:{" "}
                        <strong>₹{item.price || item.productId?.price}</strong>
                      </p>

                      {/* Quantity Controls */}
                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => decreaseQty(item)}
                        >
                          −
                        </button>

                        <span className="fw-bold">{item.quantity}</span>

                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => increaseQty(item)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3 text-center">
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() =>
                        dispatch(
                          removeFromCartAsync({
                            productId: getId(item),
                          }),
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title fw-bold">Order Summary</h5>
                <hr />

                <p className="mb-2">
                  Items: <strong>{cartItems.length}</strong>
                </p>

                <p className="mb-3">
                  Total Price:
                  <span className="fw-bold text-success ms-2">
                    ₹{totalPrice}
                  </span>
                </p>

                <div className="d-grid gap-2">
                  <button
                    className="btn btn-success"
                    onClick={() => navigate("/checkout")}
                  >
                    Proceed to Checkout
                  </button>

                  <Link to="/products" className="btn btn-outline-primary">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
