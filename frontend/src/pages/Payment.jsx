import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCartAsync } from "../features/cart/cartSlice";
import api from "../api/axiosInstance";
import {
  CreditCard,
  Lock,
  ChevronLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react";

function Payment() {
  const { state } = useLocation(); // 🛡️ This retrieves the data from Checkout.js
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect back if someone tries to access /payment without checkout data
  if (!state) {
    navigate("/checkout");
    return null;
  }

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 🚀 THE FIX: Sending both 'items' and 'cartItems' to match backend expectations
      const finalOrder = {
        items: state.cartItems || [], // Standard naming
        cartItems: state.cartItems || [], // Fallback for Checkout.js naming
        totalAmount: state.totalAmount,
        shippingAddress: state.shippingAddress,
        customerName: state.customerName,
        paymentMethod: "Online Payment",
        status: "Paid",
        date: new Date().toISOString(),
      };

      // Send to your backend
      // ✅ Using the exact route from your checkout: "/users/place-order"
      const response = await api.post("/users/place-order", finalOrder);

      if (response.status === 201 || response.status === 200) {
        // Clear the Redux cart (Database sync)
        dispatch(clearCartAsync());
        // Go to thanks page
        navigate("/thanks", { state: { method: "Online Card" } });
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert(
        error.response?.data?.message || "Payment failed. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-vh-100 py-5 bg-light">
      <div className="container" style={{ maxWidth: "600px" }}>
        <button
          onClick={() => navigate("/checkout")}
          className="btn btn-link text-decoration-none mb-4 d-flex align-items-center gap-2"
        >
          <ChevronLeft size={20} /> Back to Shipping
        </button>

        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="bg-primary p-4 text-white text-center">
            <Lock className="mb-2" size={32} />
            <h4 className="fw-bold mb-0">Secure Payment</h4>
            <p className="small opacity-75 mb-0">
              Order Total: ₹{state.totalAmount?.toLocaleString()}
            </p>
          </div>

          <div className="card-body p-4 p-md-5">
            <form onSubmit={handlePayment}>
              <div className="mb-4">
                <label className="form-label small fw-bold text-muted text-uppercase">
                  Card Number
                </label>
                <div className="input-group border rounded-3 bg-light">
                  <span className="input-group-text bg-transparent border-0">
                    <CreditCard size={18} />
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 bg-transparent py-3 shadow-none"
                    placeholder="1234 5678 9101 1121"
                    required
                  />
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted text-uppercase">
                    Expiry
                  </label>
                  <input
                    type="text"
                    className="form-control py-3 bg-light border-0 shadow-none"
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted text-uppercase">
                    CVV
                  </label>
                  <input
                    type="password"
                    className="form-control py-3 bg-light border-0 shadow-none"
                    placeholder="***"
                    required
                  />
                </div>
              </div>

              <div className="bg-light p-3 rounded-3 mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Subtotal</span>
                  <span className="fw-bold small">₹{state.totalAmount}</span>
                </div>
                <div className="d-flex justify-content-between text-success">
                  <span className="small">Shipping</span>
                  <span className="fw-bold small">FREE</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow-blue"
              >
                {isProcessing ? (
                  <span className="d-flex align-items-center justify-content-center gap-2">
                    <Loader2 className="animate-spin" size={20} /> Processing...
                  </span>
                ) : (
                  `Pay ₹${state.totalAmount?.toLocaleString()}`
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-muted small mt-4 d-flex align-items-center justify-content-center gap-2">
          <CheckCircle2 size={14} className="text-success" /> Your payment
          information is encrypted and secure.
        </p>
      </div>

      <style>{`
        .shadow-blue { box-shadow: 0 10px 20px -5px rgba(13, 110, 253, 0.3); }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default Payment;
