import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

// ==========================================
// 1. ASYNC THUNKS (Database Operations)
// ==========================================

// ✅ FETCH CART
export const fetchCartAsync = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/cart");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart",
      );
    }
  },
);

// ✅ ADD / INCREMENT
export const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async (product, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/cart/add", {
        // 🔥 FIX: supports all formats
        productId: product.productId || product._id || product.id,
        quantity: product.quantity || 1,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add");
    }
  },
);

// ✅ DECREASE
export const decreaseQuantityAsync = createAsyncThunk(
  "cart/decreaseQuantity",
  async (productId, { rejectWithValue }) => {
    try {
      const id = productId.productId || productId;

      const response = await api.post("/users/cart/decrease", {
        productId: id,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to decrease",
      );
    }
  },
);

// ✅ REMOVE ITEM
export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { rejectWithValue }) => {
    try {
      const id = productId.productId || productId;

      const response = await api.delete(`/users/cart/remove/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove",
      );
    }
  },
);

// ✅ CLEAR CART
export const clearCartAsync = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete("/users/cart/clear");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear cart",
      );
    }
  },
);

// ==========================================
// 2. SLICE SETUP
// ==========================================

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
    status: "idle",
    error: null,
  },

  reducers: {
    clearCart: (state) => {
      state.cart = [];
      state.status = "idle";
    },

    clearLocalCart: (state) => {
      state.cart = [];
    },
  },

  extraReducers: (builder) => {
    builder

      // ✅ FETCH CART
      .addCase(fetchCartAsync.pending, (state) => {
        state.status = "loading";
      })

      .addCase(fetchCartAsync.fulfilled, (state, action) => {
        state.status = "succeeded";

        // 🔥 FLEXIBLE RESPONSE HANDLING
        state.cart =
          action.payload?.items || action.payload?.cart || action.payload || [];
      })

      .addCase(fetchCartAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ✅ HANDLE ALL OTHER SUCCESS (ADD / REMOVE / DECREASE / CLEAR)
      .addMatcher(
        (action) =>
          action.type.endsWith("/fulfilled") &&
          action.type.startsWith("cart/") &&
          action.type !== fetchCartAsync.fulfilled.type,

        (state, action) => {
          state.cart =
            action.payload?.items ||
            action.payload?.cart ||
            action.payload ||
            [];
        },
      )

      // ❌ HANDLE ERRORS
      .addMatcher(
        (action) =>
          action.type.endsWith("/rejected") && action.type.startsWith("cart/"),

        (state, action) => {
          state.error = action.payload;
        },
      );
  },
});

export const { clearCart, clearLocalCart } = cartSlice.actions;

export default cartSlice.reducer;


//data flow
// axios.get("/wishlist")
//         ↓
// res.data = { items: [...] }
//         ↓
// return res.data
//         ↓
// action.payload = { items: [...] }
//         ↓
// action.payload.items ✅