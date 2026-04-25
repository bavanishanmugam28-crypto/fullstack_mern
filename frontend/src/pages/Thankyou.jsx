import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ShoppingBag, ArrowRight, Package } from "lucide-react";

function Thanks() {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    // Generate a random professional-looking Order ID
    const id = "HS-" + Math.random().toString(36).toUpperCase().substring(2, 10);
    setOrderId(id);
  }, []);

  return (
    <div className="login-page-wrapper d-flex align-items-center justify-content-center min-vh-100">
      <div className="glass-panel login-card p-4 p-md-5 shadow-lg text-center" style={{ maxWidth: '550px' }}>
        
        {/* Success Animation Icon */}
        <div className="mb-4">
          <div className="login-icon-circle mx-auto mb-3" style={{ background: 'linear-gradient(135deg, #00b894, #55efc4)', width: '80px', height: '80px' }}>
            <CheckCircle size={45} className="text-white" />
          </div>
          <h1 className="fw-bold brand-text">Order Confirmed!</h1>
          <p className="text-muted">Thank you for shopping with HappieShop.</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-light rounded-4 p-4 mb-4 border-0 shadow-sm">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="text-muted small fw-bold text-uppercase">Order Number</span>
            <span className="fw-bold text-primary">{orderId}</span>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <span className="text-muted small fw-bold text-uppercase">Status</span>
            <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2">
               Processing
            </span>
          </div>
        </div>

        <div className="mb-4 text-center">
          <p className="small text-muted mb-0">
            <Package size={16} className="me-2 text-primary" />
            A confirmation email has been sent to your inbox.
          </p>
          <p className="small text-muted">Your items will arrive in 3-5 business days.</p>
        </div>

        {/* Action Buttons */}
        <div className="d-grid gap-2">
          <button 
            className="btn btn-primary-glow py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
            onClick={() => navigate("/products")}
          >
            <ShoppingBag size={18} /> Continue Shopping
          </button>
          
          <button 
            className="btn btn-link text-decoration-none text-muted small fw-bold"
            onClick={() => navigate("/")}
          >
            Go to Dashboard <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
}

export default Thanks;