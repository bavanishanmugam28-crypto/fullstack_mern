import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Mail, Lock, CheckCircle, ArrowRight } from "lucide-react";

// ✅ Import the new Async Thunk
import { signupUserAsync, clearError } from "../features/auth/authSlice";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Pull in the 'status' to handle loading states
  const { error, status } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match!");
      return;
    }

    try {
      // ✅ dispatch().unwrap() lets us wait for the exact moment the DB responds
      await dispatch(signupUserAsync({ email, password })).unwrap();

      // If it succeeds, immediately send them to the login page!
      navigate("/login");
    } catch (err) {
      // If it fails (e.g., user already exists), Redux handles the error message.
      console.log("Signup failed.");
    }
  };

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    setLocalError("");
    if (error) dispatch(clearError());
  };

  return (
    <div className="login-page-wrapper d-flex align-items-center justify-content-center min-vh-100">
      <div className="glass-panel login-card p-4 p-md-5 shadow-lg">
        {/* Header Section */}
        <div className="text-center mb-4">
          <div
            className="login-icon-circle mx-auto mb-3"
            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
          >
            <UserPlus size={32} className="text-white" />
          </div>
          <h2 className="fw-bold brand-text">Create Account</h2>
          <p className="small text-muted">
            Join our community and start shopping
          </p>
        </div>

        {/* Dynamic Error Messaging */}
        {(error || localError) && (
          <div
            className="alert alert-danger border-0 text-center py-2 mb-4 shadow-sm"
            role="alert"
          >
            {error || localError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-3">
            <label className="form-label fw-bold text-primary d-flex align-items-center gap-2 small mb-2">
              <Mail size={14} /> Email Address
            </label>
            <input
              type="email"
              className="form-control modern-input"
              value={email}
              onChange={handleChange(setEmail)}
              required
              placeholder="user@example.com"
            />
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <label className="form-label fw-bold text-primary d-flex align-items-center gap-2 small mb-2">
              <Lock size={14} /> Create Password
            </label>
            <input
              type="password"
              className="form-control modern-input"
              value={password}
              onChange={handleChange(setPassword)}
              required
              placeholder="••••••••"
            />
          </div>

          {/* Confirm Password Field */}
          <div className="mb-4">
            <label className="form-label fw-bold text-primary d-flex align-items-center gap-2 small mb-2">
              <CheckCircle size={14} /> Confirm Password
            </label>
            <input
              type="password"
              className="form-control modern-input"
              value={confirmPassword}
              onChange={handleChange(setConfirmPassword)}
              required
              placeholder="••••••••"
            />
          </div>

          {/* ✅ Button disables while waiting for the database */}
          <button
            type="submit"
            className="btn btn-primary-glow w-100 py-3 fw-bold mb-3 d-flex align-items-center justify-content-center gap-2"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Creating Account..." : "Create My Account"}
            {status !== "loading" && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="mt-3 text-center mb-0 small text-muted">
          Already have an account?
          <Link
            to="/login"
            className="ms-2 text-primary fw-bold text-decoration-none hover-underline"
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
