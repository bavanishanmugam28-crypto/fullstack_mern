import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, UserCircle, ShieldCheck, Mail, Lock } from "lucide-react";

// ✅ 1. Correct Imports: Only use what exists in your new MongoDB slices
import {
  loginUserAsync,
  clearError,
  setUser as setAuthUser,
} from "../features/auth/authSlice";
import { fetchCartAsync } from "../features/cart/cartSlice";
import { fetchWishlistAsync } from "../features/wishlist/wishlistSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, status } = useSelector((state) => state.auth);

  // ⭐ THE MAGIC FUNCTION: Logs you in and triggers cloud data fetch
  const executeLoginAndRedirect = async (credentials) => {
    try {
      // 1. Wait for Node.js to verify credentials and return the JWT token
      await dispatch(loginUserAsync(credentials)).unwrap();

      // 2. TRIGGER CLOUD FETCH:
      // Your Axios Interceptor handles the token automatically now.
      // We don't "set" data manually; we fetch it from the source (MongoDB).
      dispatch(fetchCartAsync());
      dispatch(fetchWishlistAsync());

      // 3. Send them to the shop
      navigate("/products");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeLoginAndRedirect({ email, password });
  };

  const handleAdminLogin = () => {
    const adminEmail = "admin@gmail.com";
    const adminPassword = "admin123";
    executeLoginAndRedirect({ email: adminEmail, password: adminPassword });
  };

  const handleGuestLogin = () => {
    // Guest doesn't have a DB account, so we just set local auth state
    const guestUser = { email: "guest", role: "guest" };
    dispatch(setAuthUser(guestUser));
    navigate("/products");
  };

  return (
    <div className="login-page-wrapper d-flex align-items-center justify-content-center min-vh-100">
      <div className="glass-panel login-card p-4 p-md-5 shadow-lg">
        <div className="text-center mb-4">
          <div
            className="login-icon-circle mx-auto mb-3"
            style={{ background: "linear-gradient(135deg, #00d2ff, #3a7bd5)" }}
          >
            <LogIn size={32} className="text-white" />
          </div>
          <h2 className="fw-bold brand-text">Welcome Back</h2>
          <p className="small text-muted">
            Enter your details to access your account
          </p>
        </div>

        {error && (
          <div
            className="alert alert-danger border-0 text-center py-2 shadow-sm"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold text-primary d-flex align-items-center gap-2 small mb-2">
              <Mail size={14} /> Email Address
            </label>
            <input
              type="email"
              className="form-control modern-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                dispatch(clearError());
              }}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold text-primary d-flex align-items-center gap-2 small mb-2">
              <Lock size={14} /> Password
            </label>
            <input
              type="password"
              className="form-control modern-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                dispatch(clearError());
              }}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary-glow w-100 py-3 fw-bold mb-3 shadow-sm"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="divider-text mb-4 text-muted">
          <span className="px-2">OR QUICK ACCESS</span>
        </div>

        <div className="d-flex gap-2 mb-4">
          <button
            type="button"
            className="btn btn-outline-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2 fw-semibold"
            onClick={handleAdminLogin}
            disabled={status === "loading"}
          >
            <ShieldCheck size={18} /> Admin
          </button>
          <button
            type="button"
            className="btn btn-outline-info w-100 py-2 d-flex align-items-center justify-content-center gap-2 fw-semibold"
            onClick={handleGuestLogin}
            disabled={status === "loading"}
          >
            <UserCircle size={18} /> Guest
          </button>
        </div>

        <p className="mt-3 text-center mb-0 small text-muted">
          Don't have an account?
          <Link
            to="/signup"
            className="ms-2 text-primary fw-bold text-decoration-none hover-underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
