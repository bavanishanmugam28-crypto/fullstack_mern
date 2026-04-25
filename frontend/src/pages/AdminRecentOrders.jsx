import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import {
  Package,
  Calendar,
  User,
  DollarSign,
  AlertCircle,
  Loader2,
} from "lucide-react";

function AdminRecentOrders() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 🛡️ Client-side Protection
    if (!isLoggedIn || user?.email !== "admin@gmail.com") {
      navigate("/");
    }
  }, [isLoggedIn, user, navigate]);

  useEffect(() => {
    const fetchAdminOrders = async () => {
      try {
        const response = await api.get("/admin/orders");
        setOrders(response.data || []);
      } catch (err) {
        // Captures 401 (Auth Failed) or 404 (Route not found)
        setError(err.response?.data?.message || "Connection to server failed");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email === "admin@gmail.com") {
      fetchAdminOrders();
    }
  }, [user]);

  if (loading)
    return (
      <div className="container mt-5 pt-5 text-center min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <Loader2 className="text-primary animate-spin mb-3" size={40} />
        <h5 className="text-primary fw-bold">
          Connecting to Magizh Database...
        </h5>
      </div>
    );

  if (error)
    return (
      <div className="container mt-5 pt-5">
        <div className="alert alert-danger shadow-lg border-0 border-start border-5 border-danger p-4 rounded-4">
          <AlertCircle className="me-3 text-danger" size={32} />
          <div>
            <h5 className="fw-bold mb-1">System Access Error</h5>
            <p className="mb-0 text-secondary">{error}</p>
            <button
              className="btn btn-sm btn-danger mt-2"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="container mt-5 pt-5 mb-5">
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
        <div className="card-header bg-primary bg-gradient text-white py-4 px-4 d-flex align-items-center border-0">
          <div className="bg-white bg-opacity-25 p-2 rounded-circle me-3">
            <Package size={28} />
          </div>
          <div>
            <h3 className="mb-0 fw-bold">Recent Orders</h3>
            <span className="text-white text-opacity-75 small">
              Live Dairy Sales Overview
            </span>
          </div>
        </div>

        <div className="card-body p-0">
          {orders.length === 0 ? (
            <div className="p-5 text-center text-muted">
              <Package size={48} className="opacity-25 mb-3" />
              <h5 className="fw-bold">No orders found in database</h5>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light border-bottom border-primary border-2">
                  <tr className="text-uppercase small fw-bold text-primary">
                    <th className="px-4 py-3">Order ID</th>
                    <th className="py-3">
                      <User size={14} className="me-1" /> Customer
                    </th>
                    <th className="py-3">
                      <Calendar size={14} className="me-1" /> Date
                    </th>
                    <th className="py-3">
                      <DollarSign size={14} className="me-1" /> Total
                    </th>
                    <th className="py-3 text-end px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => (
                    <tr key={idx} className="border-bottom">
                      <td className="px-4 py-3">
                        <span className="badge bg-primary bg-opacity-10 text-primary fw-bold">
                          #{order.orderId?.toUpperCase().slice(-8)}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="fw-bold text-dark">
                          {order.customerName || "Member"}
                        </div>
                        <div className="small text-muted">
                          {order.userEmail}
                        </div>
                      </td>
                      <td className="py-3 text-secondary">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 fw-bold text-primary">
                        ₹{order.totalAmount?.toLocaleString()}
                      </td>
                      <td className="py-3 text-end px-4">
                        <span className="badge rounded-pill px-3 py-2 bg-success bg-opacity-10 text-success border border-success border-opacity-25">
                          {order.status || "Paid"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminRecentOrders;
