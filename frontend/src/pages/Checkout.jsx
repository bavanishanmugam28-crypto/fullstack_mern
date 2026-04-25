import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCartAsync } from "../features/cart/cartSlice";
import api from "../api/axiosInstance";
import {
  User,
  MapPin,
  Truck,
  ArrowRight,
  CreditCard,
  Banknote,
  Loader2,
  CheckCircle2,
  ChevronLeft,
} from "lucide-react";

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.cart || []);

  const [name, setName] = useState(user?.name || "");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate Total
  const totalAmount = cartItems.reduce((acc, item) => {
    const price = item.productId?.price || item.price || 0;
    return acc + price * (item.quantity || 1);
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Prepare clean data for the Backend
    const formattedItems = cartItems.map((item) => ({
      productId: item.productId?._id || item.productId,
      name: item.productId?.name || item.name,
      price: item.productId?.price || item.price,
      quantity: item.quantity,
      image: item.productId?.image || item.image, // Ensures images show in Order History
    }));

    const orderPayload = {
      cartItems: formattedItems,
      totalAmount: totalAmount,
      shippingAddress: address,
      customerName: name,
    };

    if (paymentMethod === "cod") {
      setIsProcessing(true);
      try {
        const response = await api.post("/users/place-order", {
          ...orderPayload,
          paymentMethod: "Cash on Delivery", // Explicit string for the DB
        });

        if (response.status === 201) {
          dispatch(clearCartAsync());
          navigate("/thanks", { state: { method: "Cash on Delivery" } });
        }
      } catch (error) {
        console.error("Checkout Error:", error);
        alert(
          error.response?.data?.message || "Order failed. Please try again.",
        );
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Redirect to Payment Page for Card selection
      navigate("/payment", {
        state: {
          ...orderPayload,
          paymentMethod: "Online Payment",
        },
      });
    }
  };

  return (
    <div className="min-vh-100 py-5 px-3" style={{ background: "#f8faff" }}>
      <div className="container" style={{ maxWidth: "1000px" }}>
        <button
          onClick={() => navigate("/cart")}
          className="btn btn-link text-primary text-decoration-none fw-bold d-flex align-items-center gap-2 p-0 mb-4"
        >
          <ChevronLeft size={20} /> Back to Cart
        </button>

        <div className="row g-4">
          {/* Left Side: Form */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="bg-primary p-3 rounded-4 shadow-blue">
                  <Truck className="text-white" size={24} />
                </div>
                <h3 className="fw-bold text-dark mb-0">Shipping Details</h3>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-bold text-muted small text-uppercase">
                    Full Name
                  </label>
                  <div className="input-group border rounded-3 overflow-hidden bg-light">
                    <span className="input-group-text bg-transparent border-0 text-primary">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      className="form-control border-0 bg-transparent py-3 shadow-none"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold text-muted small text-uppercase">
                    Delivery Address
                  </label>
                  <div className="input-group border rounded-3 overflow-hidden bg-light">
                    <span className="input-group-text bg-transparent border-0 text-primary pt-3 align-items-start">
                      <MapPin size={18} />
                    </span>
                    <textarea
                      className="form-control border-0 bg-transparent py-3 shadow-none"
                      rows="3"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street name, City, State, Pincode"
                    ></textarea>
                  </div>
                </div>

                <h5 className="fw-bold text-dark mt-5 mb-3">Payment Method</h5>
                <div className="d-grid gap-3 mb-4">
                  {/* Card Option */}
                  <div
                    className={`p-3 rounded-4 border-2 transition-all cursor-pointer d-flex align-items-center justify-content-between ${paymentMethod === "card" ? "border-primary bg-primary bg-opacity-10" : "border-light bg-white opacity-75"}`}
                    onClick={() => setPaymentMethod("card")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <CreditCard
                        size={24}
                        className={
                          paymentMethod === "card"
                            ? "text-primary"
                            : "text-muted"
                        }
                      />
                      <span
                        className={`fw-bold ${paymentMethod === "card" ? "text-primary" : "text-dark"}`}
                      >
                        Online Card Payment
                      </span>
                    </div>
                    <div
                      className={`rounded-circle border ${paymentMethod === "card" ? "bg-primary border-primary" : "border-2"} `}
                      style={{ width: 20, height: 20 }}
                    ></div>
                  </div>

                  {/* COD Option */}
                  <div
                    className={`p-3 rounded-4 border-2 transition-all cursor-pointer d-flex align-items-center justify-content-between ${paymentMethod === "cod" ? "border-primary bg-primary bg-opacity-10" : "border-light bg-white opacity-75"}`}
                    onClick={() => setPaymentMethod("cod")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <Banknote
                        size={24}
                        className={
                          paymentMethod === "cod"
                            ? "text-primary"
                            : "text-muted"
                        }
                      />
                      <span
                        className={`fw-bold ${paymentMethod === "cod" ? "text-primary" : "text-dark"}`}
                      >
                        Cash on Delivery
                      </span>
                    </div>
                    <div
                      className={`rounded-circle border ${paymentMethod === "cod" ? "bg-primary border-primary" : "border-2"} `}
                      style={{ width: 20, height: 20 }}
                    ></div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow-blue mt-3"
                >
                  {isProcessing ? (
                    <Loader2 className="animate-spin" />
                  ) : paymentMethod === "cod" ? (
                    "Place My Order"
                  ) : (
                    "Proceed to Payment"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="col-lg-5">
            <div
              className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top"
              style={{ top: "2rem" }}
            >
              <h5 className="fw-bold text-dark mb-4 border-bottom pb-3">
                Order Summary
              </h5>
              <div className="d-flex flex-column gap-3 mb-4 max-vh-50 overflow-auto pe-2">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center gap-3 bg-light p-2 rounded-3 border-light"
                  >
                    <img
                      src={
                        item.productId?.image ||
                        item.image ||
                        "https://via.placeholder.com/50"
                      }
                      alt="item"
                      className="rounded-2"
                      style={{ width: 50, height: 50, objectFit: "cover" }}
                    />
                    <div className="flex-grow-1">
                      <p className="mb-0 fw-bold small text-dark truncate-1">
                        {item.productId?.name || item.name}
                      </p>
                      <span className="text-muted extra-small">
                        {item.quantity} × ₹
                        {(
                          item.productId?.price || item.price
                        )?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-auto">
                <span className="text-muted fw-bold text-uppercase small">
                  Grand Total
                </span>
                <span className="h4 mb-0 fw-black text-primary">
                  ₹{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .shadow-blue { box-shadow: 0 10px 20px -5px rgba(13, 110, 253, 0.3); }
        .truncate-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .extra-small { font-size: 0.75rem; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default Checkout;
