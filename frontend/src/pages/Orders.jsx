import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import {
  Package,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Clock,
  CreditCard,
  Banknote,
  XCircle,
  AlertTriangle,
  Check,
  Home,
  Truck,
  Star,
} from "lucide-react";

// --- 1. Order Progress Tracker Component ---
const OrderTimeline = ({ status }) => {
  const steps = [
    { label: "Placed", key: "placed", icon: <Clock size={16} /> },
    { label: "Processing", key: "processing", icon: <Package size={16} /> },
    { label: "Shipped", key: "shipped", icon: <Truck size={16} /> },
    { label: "Delivered", key: "delivered", icon: <Home size={16} /> },
  ];

  const statusMap = { placed: 0, processing: 1, shipped: 2, delivered: 3 };
  const currentStepIndex = statusMap[status?.toLowerCase()] ?? 0;

  return (
    <div className="position-relative mb-5 mt-4 px-2">
      <div
        className="d-flex justify-content-between position-relative"
        style={{ zIndex: 1 }}
      >
        {/* Connecting Background Line */}
        <div
          className="position-absolute top-50 start-0 translate-middle-y w-100 bg-light"
          style={{ height: "2px", zIndex: -1 }}
        >
          <div
            className="bg-primary h-100 transition-all"
            style={{
              width: `${(currentStepIndex / 3) * 100}%`,
              transition: "0.8s ease-in-out",
            }}
          ></div>
        </div>

        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;
          return (
            <div
              key={step.key}
              className="text-center"
              style={{ width: "50px" }}
            >
              <div
                className={`rounded-circle d-flex align-items-center justify-content-center mx-auto shadow-sm ${isActive || isCompleted ? "bg-primary text-white border-primary" : "bg-white text-muted border"}`}
                style={{ width: "32px", height: "32px", border: "2px solid" }}
              >
                {isCompleted ? <Check size={14} strokeWidth={3} /> : step.icon}
              </div>
              <span
                className={`small d-block mt-2 fw-bold ${isActive || isCompleted ? "text-dark" : "text-muted"}`}
                style={{ fontSize: "0.6rem" }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- 2. Cancellation Modal Component ---
const CancelModal = ({ onClose, onConfirm }) => {
  const [reason, setReason] = useState("");
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(4px)",
        zIndex: 1050,
      }}
    >
      <div
        className="bg-white p-4 rounded-4 shadow-lg text-center border animate-fade-in"
        style={{ maxWidth: "400px", width: "90%" }}
      >
        <AlertTriangle size={40} className="text-danger mb-3 mx-auto" />
        <h4 className="fw-bold">Cancel Order?</h4>
        <p className="text-muted small">
          We're sorry to see you go. Why are you canceling?
        </p>
        <select
          className="form-select mb-3 border-2 shadow-sm"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          <option value="">Choose a reason...</option>
          <option value="Mistake">Ordered by mistake</option>
          <option value="Price">Found a better price</option>
          <option value="Delay">Delivery is too slow</option>
          <option value="Other">Other reason</option>
        </select>
        <div className="d-flex gap-2">
          <button
            className="btn btn-light w-100 rounded-pill fw-bold"
            onClick={onClose}
          >
            No, Keep it
          </button>
          <button
            className="btn btn-danger w-100 rounded-pill fw-bold"
            disabled={!reason}
            onClick={() => onConfirm(reason)}
          >
            Confirm Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 3. MAIN PAGE COMPONENT ---
const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/users/orders");
      const data = response.data?.orders || response.data || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🎲 DEMO MODE: Randomly assign statuses based on the ID so the UI looks diverse
  const getSmartStatus = (order) => {
    if (order.status?.toLowerCase() === "canceled") return "canceled";
    const idSeed = order._id ? order._id.toString().slice(-1) : "0";
    const charCode = idSeed.charCodeAt(0);

    if (charCode % 4 === 0) return "delivered";
    if (charCode % 4 === 1) return "shipped";
    if (charCode % 4 === 2) return "processing";
    return "placed";
  };

  const handleCancelOrder = (reason) => {
    // Local simulation: Update the state to show the order as canceled immediately
    setOrders(
      orders.map((o) =>
        o._id === cancelingId ? { ...o, status: "Canceled" } : o,
      ),
    );
    setCancelingId(null);
  };

  if (loading)
    return (
      <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
        <Loader2 className="text-primary animate-spin mb-2" size={40} />
        <span className="text-muted fw-bold">Loading your orders...</span>
      </div>
    );

  return (
    <div className="container py-5 mt-5">
      <button
        onClick={() => navigate("/products")}
        className="btn btn-link text-decoration-none d-flex align-items-center gap-2 mb-4 p-0 text-primary"
      >
        <ArrowLeft size={18} /> Back to Shopping
      </button>

      <h2 className="fw-bold mb-4">Order History</h2>

      {orders.length === 0 ? (
        <div className="text-center py-5 border rounded-4 bg-white shadow-sm">
          <Package size={48} className="text-muted mb-3" />
          <p className="text-muted m-0">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="row g-4">
          {orders.map((order) => {
            const displayStatus = getSmartStatus(order);
            const isCanceled = displayStatus === "canceled";

            return (
              <div key={order?._id} className="col-12">
                <div
                  className={`card border-0 shadow-sm rounded-4 overflow-hidden ${isCanceled ? "opacity-75 grayscale" : ""}`}
                >
                  {/* Header Info */}
                  <div className="bg-light px-4 py-3 border-bottom d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                      <span className="text-muted small fw-bold text-uppercase d-block">
                        Order Reference
                      </span>
                      <span className="fw-bold text-dark">
                        #{order?.orderId || order?._id?.slice(-8)}
                      </span>
                    </div>
                    <div className="text-md-end">
                      <span className="text-muted small fw-bold text-uppercase d-block">
                        Amount Paid
                      </span>
                      <span className="fw-bold text-primary fs-5">
                        ₹{(order?.totalAmount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="card-body p-4">
                    <div className="row align-items-center">
                      <div className="col-lg-8">
                        {/* 🔥 Timeline Logic */}
                        {!isCanceled && (
                          <OrderTimeline status={displayStatus} />
                        )}

                        <div className="mt-3">
                          {order.items?.map((item, idx) => (
                            <div
                              key={idx}
                              className="d-flex align-items-center gap-3 mb-2 p-2 rounded-3 border-bottom border-light border-opacity-50"
                            >
                              <img
                                src={
                                  item?.image ||
                                  item?.productId?.image ||
                                  "https://via.placeholder.com/150"
                                }
                                alt="p"
                                className="bg-white p-1 rounded border"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  objectFit: "contain",
                                }}
                              />
                              <div className="flex-grow-1">
                                <h6 className="mb-0 fw-bold small">
                                  {item?.name ||
                                    item?.productId?.name ||
                                    "Product"}
                                </h6>
                                <small className="text-muted">
                                  Quantity: {item?.quantity || 1} • ₹
                                  {item?.price || 0}
                                </small>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="col-lg-4 border-start ps-lg-4 mt-4 mt-lg-0 text-center text-lg-start">
                        <div className="mb-3">
                          <label className="text-muted small fw-bold text-uppercase d-block mb-1">
                            Status
                          </label>
                          <span
                            className={`badge px-3 py-2 rounded-pill ${
                              isCanceled
                                ? "bg-danger"
                                : displayStatus === "delivered"
                                  ? "bg-success"
                                  : displayStatus === "shipped"
                                    ? "bg-primary"
                                    : "bg-info"
                            }`}
                          >
                            {isCanceled ? (
                              <XCircle size={14} className="me-1" />
                            ) : (
                              <CheckCircle2 size={14} className="me-1" />
                            )}
                            {displayStatus.toUpperCase()}
                          </span>
                        </div>

                        <div className="mb-4">
                          <label className="text-muted small fw-bold text-uppercase d-block mb-1">
                            Payment Mode
                          </label>
                          <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-2 small fw-bold text-dark">
                            {order?.paymentMethod
                              ?.toLowerCase()
                              .includes("cash") ? (
                              <>
                                <Banknote size={16} className="text-success" />{" "}
                                Cash On Delivery
                              </>
                            ) : (
                              <>
                                <CreditCard
                                  size={16}
                                  className="text-primary"
                                />{" "}
                                Online Payment
                              </>
                            )}
                          </div>
                        </div>

                        {/* 🔘 Cancel Logic: Only show for 'Placed' orders */}
                        {!isCanceled && displayStatus === "placed" && (
                          <button
                            className="btn btn-outline-danger btn-sm w-100 rounded-pill fw-bold py-2 shadow-sm"
                            onClick={() => setCancelingId(order._id)}
                          >
                            Cancel Order
                          </button>
                        )}

                        {/* 🌟 Review Logic: Only show for 'Delivered' orders */}
                        {displayStatus === "delivered" && (
                          <button className="btn btn-warning text-dark btn-sm w-100 rounded-pill fw-bold py-2 shadow-sm d-flex align-items-center justify-content-center gap-2">
                            <Star size={14} fill="currentColor" /> Write Review
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- Cancel Modal Trigger --- */}
      {cancelingId && (
        <CancelModal
          onClose={() => setCancelingId(null)}
          onConfirm={handleCancelOrder}
        />
      )}

      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .transition-all { transition: all 0.5s ease-in-out; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        .grayscale { filter: grayscale(1); }
      `}</style>
    </div>
  );
};

export default OrdersPage;
