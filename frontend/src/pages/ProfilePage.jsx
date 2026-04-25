import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// ✅ FIXED: Using your custom axios instance for security & token handling
import api from "../api/axiosInstance";
import {
  User,
  Mail,
  Calendar,
  Users,
  Save,
  Loader2,
  ArrowLeft,
} from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();

  // ✅ Pulling the actual logged-in user from Redux
  const { user } = useSelector((state) => state.auth);
  const userEmail = user?.email || "";

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    email: userEmail,
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // ==========================================
  // 📥 FETCH DATA ON LOAD
  // ==========================================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // 🟢 FIXED: Using 'api.get' automatically attaches your Bearer Token
        // We call /users/profile because the token already contains the user identity
        const response = await api.get("/users/profile");

        if (response.data) {
          setFormData({
            name: response.data.name || "",
            age: response.data.age || "",
            gender: response.data.gender || "",
            email: response.data.email || userEmail,
          });
        }
      } catch (error) {
        console.error("Profile Fetch Error:", error);
        // If 401 occurs, it usually means the token is expired
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userEmail]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ==========================================
  // 💾 SAVE CHANGES
  // ==========================================
  const handleSave = async () => {
    if (!formData.name) return alert("Please enter your name.");

    setIsSaving(true);
    try {
      // 🟢 FIXED: Using 'api.put' to send data securely to the backend
      const response = await api.put("/users/profile", formData);

      if (response.status === 200) {
        alert("✅ Profile updated successfully!");
      }
    } catch (error) {
      console.error("Profile Save Error:", error);
      alert("❌ Failed to save profile. Please check your connection.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <Loader2 className="text-primary animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="container py-5 mt-4">
      {/* --- BACK TO SHOPPING BUTTON --- */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/products")}
          className="btn btn-link text-decoration-none text-primary fw-bold d-flex align-items-center gap-2 p-0 shadow-none"
        >
          <ArrowLeft size={20} />
          Back to Shopping
        </button>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-9">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="row g-0">
              {/* Left Sidebar - Profile Summary (BLUE THEME) */}
              <div className="col-md-4 bg-primary bg-opacity-10 d-flex flex-column align-items-center justify-content-center p-5 border-end border-light">
                <div
                  className="rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center mb-3 border border-5 border-white"
                  style={{ width: "120px", height: "120px" }}
                >
                  <span className="text-primary fw-bold display-4">
                    {formData.name ? (
                      formData.name.charAt(0).toUpperCase()
                    ) : (
                      <User size={48} />
                    )}
                  </span>
                </div>
                <h4 className="fw-bold text-dark text-center mb-1">
                  {formData.name || "New User"}
                </h4>
                <p className="text-muted small mb-0">{formData.email}</p>

                <div className="mt-4 w-100">
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Profile Strength</span>
                    <span>{formData.name ? "100%" : "50%"}</span>
                  </div>
                  <div className="progress" style={{ height: "6px" }}>
                    <div
                      className="progress-bar bg-primary"
                      role="progressbar"
                      style={{ width: formData.name ? "100%" : "50%" }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Right Side - Editable Form */}
              <div className="col-md-8 p-4 p-lg-5 bg-white">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h3 className="h4 fw-bold mb-0 text-dark">
                    Account Settings
                  </h3>
                  <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill">
                    Verified User
                  </span>
                </div>

                <div className="row g-4">
                  <div className="col-12">
                    <label className="form-label text-muted small fw-bold text-uppercase d-flex align-items-center gap-2">
                      <User size={14} className="text-primary" /> Full Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control form-control-lg bg-light border-0 rounded-3 shadow-none fs-6 border-start border-primary border-3"
                      placeholder="e.g. Bavan Kumar"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold text-uppercase d-flex align-items-center gap-2">
                      <Calendar size={14} className="text-primary" /> Age
                    </label>
                    <input
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      className="form-control form-control-lg bg-light border-0 rounded-3 shadow-none fs-6"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold text-uppercase d-flex align-items-center gap-2">
                      <Users size={14} className="text-primary" /> Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="form-select form-select-lg bg-light border-0 rounded-3 shadow-none fs-6"
                    >
                      <option value="">Choose...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label text-muted small fw-bold text-uppercase d-flex align-items-center gap-2">
                      <Mail size={14} className="text-primary" /> Email Address
                    </label>
                    <input
                      value={formData.email}
                      readOnly
                      disabled
                      className="form-control form-control-lg bg-secondary bg-opacity-10 border-0 rounded-3 text-muted fs-6"
                    />
                  </div>

                  <div className="col-12 mt-5">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="btn btn-primary btn-lg w-100 fw-bold rounded-3 py-3 d-flex align-items-center justify-content-center gap-2 transition-all shadow-sm shadow-primary-subtle"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          Updating Profile...
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
