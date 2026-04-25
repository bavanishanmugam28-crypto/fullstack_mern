import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// 🛡️ Interceptor
api.interceptors.request.use(
  (config) => {
    const storedUser =
      localStorage.getItem("user") ||
      localStorage.getItem("loggedInUser") ||
      localStorage.getItem("authUser");

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);

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
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Session expired. Please login again.");
    }
    return Promise.reject(error);
  },
);

export default api;
