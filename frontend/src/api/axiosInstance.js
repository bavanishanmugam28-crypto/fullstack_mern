import axios from "axios";

// ✅ 1. Use a flexible Base URL
const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// 🛡️ The "Passport Office" (Interceptor)
api.interceptors.request.use(
  (config) => {
    // ✅ 2. Check ALL possible keys you might have used for storage
    const storedUser =
      localStorage.getItem("user") ||
      localStorage.getItem("loggedInUser") ||
      localStorage.getItem("authUser");

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);

        // ✅ 3. Handle different token structures (some use .token, some use .accessToken)
        const token =
          userData.token || userData.accessToken || userData.credential;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Auth Interceptor Error:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ✅ 4. Add a Response Interceptor to catch 401s (Expired Tokens)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Session expired. Please login again.");
      // Optional: localStorage.clear(); window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
