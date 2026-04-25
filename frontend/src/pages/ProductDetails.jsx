import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCartAsync,
  decreaseQuantityAsync,
} from "../features/cart/cartSlice";
import { addToWishlistAsync } from "../features/wishlist/wishlistSlice";
import api from "../api/axiosInstance";
import { Star, ArrowLeft, Truck, Zap } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { cart, status: cartStatus } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const isUpdating = cartStatus === "loading";

  

  useEffect(() => {
    const fetchProduct = async () => {
      window.scrollTo(0, 0);
      setLoading(true);
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product?.category) {
      const fetchRelated = async () => {
        try {
          const response = await api.get(
            `/products?category=${product.category}`,
          );
          const filtered = response.data
            .filter((p) => (p._id || p.id) !== id)
            .slice(0, 4);
          setRelatedProducts(filtered);
        } catch (error) {
          console.error("Error fetching related products:", error);
        }
      };
      fetchRelated();
    }
  }, [product, id]);

  const cartItem = cart.find(
    (item) => (item.productId?._id || item._id || item.id) === id,
  );
  const quantity = cartItem ? cartItem.quantity : 0;

  const isWishlisted = wishlist.some(
    (item) => (item.productId?._id || item._id || item.id) === id,
  );

  const handleAction = (action) => {
    if (!isLoggedIn || user?.role === "guest") {
      alert("Please login to continue");
      navigate("/login");
      return;
    }
    if (user?.email === "admin@gmail.com") {
      alert("Admins cannot perform this action");
      return;
    }
    action();
  };

  if (loading)
    return (
      <div className="text-center mt-5 pt-5">
        <h5>Loading Product...</h5>
      </div>
    );
  if (!product)
    return (
      <div className="text-center mt-5 pt-5">
        <h5>Product not found.</h5>
      </div>
    );

  return (
    <div className="container mt-5 pt-5 pb-5">
      <style>{`
        .product-card-hover { transition: all 0.3s ease; border-radius: 15px; overflow: hidden; }
        .product-card-hover:hover { transform: translateY(-8px); box-shadow: 0 12px 24px rgba(0,0,0,0.1) !important; }
        .badge-urgency { font-size: 0.7rem; font-weight: 700; padding: 5px 10px; border-radius: 5px; }
        .text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        
        /* Social Proof Styles */
        .social-proof-box {
          border-left: 4px solid #dc3545 !important;
          transition: all 0.3s ease;
        }
        .social-proof-box:hover {
          transform: scale(1.02);
          background-color: rgba(220, 53, 69, 0.15) !important;
        }
        .pulse-icon {
          animation: pulse-red 2s infinite;
        }
        @keyframes pulse-red {
          0% { transform: scale(0.95); opacity: 0.8; }
          70% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
      `}</style>

      <div className="mb-4">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>
      </div>

      <div className="row g-4">
        <div className="col-md-6 text-center">
          <img
            src={product.image}
            alt={product.name}
            className="img-fluid rounded shadow-sm"
            style={{ maxHeight: "450px", objectFit: "contain" }}
          />
        </div>

        <div className="col-md-6">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active">{product.category}</li>
            </ol>
          </nav>

          <h1 className="display-5 fw-bold">{product.name}</h1>

          <div className="d-flex align-items-center mb-3">
            <span className="badge bg-warning text-dark me-2">
              ★ {product.rating?.rate}
            </span>
            <span className="text-muted small">
              ({product.rating?.count} reviews)
            </span>
          </div>

          <h2 className="text-success mb-4">₹{product.price}</h2>
          <p className="lead text-muted">{product.description}</p>

          <hr className="my-4" />

          <div className="d-flex gap-3 align-items-center">
            {quantity > 0 ? (
              <div className="d-flex align-items-center border rounded">
                <button
                  className="btn btn-light px-3"
                  disabled={isUpdating}
                  onClick={() =>
                    handleAction(() => dispatch(decreaseQuantityAsync(id)))
                  }
                >
                  -
                </button>
                <span className="px-4 fw-bold">{quantity}</span>
                <button
                  className="btn btn-light px-3"
                  disabled={isUpdating}
                  onClick={() =>
                    handleAction(() => dispatch(addToCartAsync(product)))
                  }
                >
                  +
                </button>
              </div>
            ) : (
              <button
                className="btn btn-primary btn-lg px-5"
                disabled={isUpdating}
                onClick={() =>
                  handleAction(() => dispatch(addToCartAsync(product)))
                }
              >
                {isUpdating ? "Processing..." : "Add to Cart"}
              </button>
            )}

            <button
              className={`btn btn-lg ${isWishlisted ? "btn-danger" : "btn-outline-danger"}`}
              onClick={() =>
                handleAction(() => dispatch(addToWishlistAsync(product)))
              }
            >
              {isWishlisted ? "❤ Wishlisted" : "❤ Wishlist"}
            </button>
          </div>

          {/* ✅ FIXED: Social Proof Section is now in the correct place */}
          <div className="social-proof-box mt-4 p-3 rounded-4 border border-danger border-opacity-10 bg-danger bg-opacity-10 shadow-sm animate-fade-in">
            <div className="d-flex align-items-center gap-2">
              <div className="pulse-icon text-danger">
                <Zap size={18} fill="currentColor" />
              </div>
              <div>
                <p
                  className="m-0 fw-bold text-dark"
                  style={{ fontSize: "0.85rem" }}
                >
                  In high demand!
                  <span className="text-danger ms-1">
                    {Math.floor(Math.random() * 15) + 5} people
                  </span>{" "}
                  added this to their cart today.
                </p>
                <p className="m-0 text-muted small">
                  Estimated delivery by{" "}
                  <span className="fw-bold text-success">
                    {new Date(
                      Date.now() + 3 * 24 * 60 * 60 * 1000,
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="small text-muted mb-1">✓ 100% Original Products</p>
            <p className="small text-muted mb-1">✓ Fast Delivery Available</p>
            <p className="small text-muted mb-1">
              ✓ Easy 14 days returns and exchanges
            </p>
          </div>
        </div>
      </div>
      {/* 🏷️ SMART INVENTORY URGENCY LABELS */}
      <div className="inventory-status mb-3">
        {product.price > 5000 ? (
          // High Value Items: Show Low Stock
          <div className="d-flex align-items-center gap-2 text-danger fw-bold animate-pulse">
            <div
              className="bg-danger rounded-circle"
              style={{ width: "8px", height: "8px" }}
            ></div>
            <span style={{ fontSize: "0.9rem" }}>
              Only {(product.name.length % 3) + 1} left in stock - order soon!
            </span>
          </div>
        ) : product.price < 1000 ? (
          // Lower Value Items: Show High Volume
          <div className="d-flex align-items-center gap-2 text-primary fw-bold">
            <Zap size={16} className="text-warning" fill="currentColor" />
            <span style={{ fontSize: "0.9rem" }}>
              Selling fast! {(product.name.length % 40) + 10} orders in last
              24hrs
            </span>
          </div>
        ) : (
          // Mid Range Items: Show Standard but Active
          <div className="d-flex align-items-center gap-2 text-success fw-bold">
            <div
              className="bg-success rounded-circle"
              style={{ width: "8px", height: "8px" }}
            ></div>
            <span style={{ fontSize: "0.9rem" }}>In Stock & Ready to Ship</span>
          </div>
        )}
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-5 pt-5 border-top">
          <h3 className="fw-bold mb-4">Recommended for You</h3>
          <div className="row g-4">
            {relatedProducts.map((p, index) => (
              <div key={p._id || p.id} className="col-6 col-md-3">
                <div className="card h-100 border-0 shadow-sm position-relative product-card-hover">
                  <div
                    className="position-absolute top-0 start-0 m-2"
                    style={{ zIndex: 2 }}
                  >
                    {index % 2 === 0 ? (
                      <span className="badge-urgency bg-danger text-white shadow-sm d-flex align-items-center gap-1">
                        <Zap size={10} /> Limited Stock
                      </span>
                    ) : (
                      <span className="badge-urgency bg-success text-white shadow-sm d-flex align-items-center gap-1">
                        <Truck size={10} /> Fast Delivery
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/product/${p._id || p.id}`}
                    className="text-decoration-none text-dark d-flex flex-column h-100"
                  >
                    <div
                      className="p-4 text-center bg-white"
                      style={{ height: "160px" }}
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="img-fluid"
                        style={{ height: "100%", objectFit: "contain" }}
                      />
                    </div>
                    <div className="card-body bg-white border-top">
                      <h6
                        className="fw-bold mb-1 text-truncate-2"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {p.name}
                      </h6>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <span className="text-primary fw-bold">₹{p.price}</span>
                        <div
                          className="text-warning small"
                          style={{ fontSize: "0.8rem" }}
                        >
                          ★ {p.rating?.rate || "4.1"}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
