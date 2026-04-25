import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

// ==========================================
// 1. ASYNC THUNKS (Using Axios)
// ==========================================

// 👤 SIGNUP: Sends new user data to MongoDB
export const signupUserAsync = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      // 🟢 FIXED: Added /users
      const response = await api.post("/users/auth/signup", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  },
);

// 🔑 LOGIN: Checks credentials against MongoDB
export const loginUserAsync = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      // 🟢 FIXED: Added /users
      const response = await api.post("/users/auth/login", credentials);

      // Save to localStorage ONLY so the user stays logged in if they refresh the page
      localStorage.setItem("loggedInUser", JSON.stringify(response.data));

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

// ==========================================
// 2. REDUX SLICE SETUP
// ==========================================

// Safely check if they are already logged in from a previous session
let storedUser = null;
try {
  const item = localStorage.getItem("loggedInUser");
  storedUser = item ? JSON.parse(item) : null;
} catch (error) {
  console.error("Failed to parse user from local storage", error);
  localStorage.removeItem("loggedInUser");
}

const initialState = {
  user: storedUser || null,
  isLoggedIn: !!storedUser,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = !!action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
      localStorage.removeItem("loggedInUser");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- LOGIN CASES ---
      .addCase(loginUserAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoggedIn = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.status = "failed";
        state.isLoggedIn = false;
        state.error = action.payload;
      })

      // --- SIGNUP CASES ---
      .addCase(signupUserAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signupUserAsync.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(signupUserAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setUser, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
