import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

// ==========================================
// 1. ASYNC THUNKS (Database Operations)
// ==========================================

// 📥 Fetch user's wishlist
export const fetchWishlistAsync = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      // 🟢 FIXED: Added /users/ prefix
      const response = await api.get("/users/wishlist");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch wishlist",
      );
    }
  },
);

// ➕ Add item to wishlist
export const addToWishlistAsync = createAsyncThunk(
  "wishlist/addToWishlist",
  async (product, { rejectWithValue }) => {
    try {
      // 🟢 FIXED: Added /users/ prefix
      const response = await api.post("/users/wishlist/add", {
        productId: product._id || product.id,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to wishlist",
      );
    }
  },
);

// ❌ Remove item from wishlist
export const removeFromWishlistAsync = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      // 🟢 FIXED: Added /users/ prefix
      const response = await api.delete(`/users/wishlist/remove/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove from wishlist",
      );
    }
  },
);

// 🧹 Clear entire wishlist
export const clearWishlistAsync = createAsyncThunk(
  "wishlist/clearWishlist",
  async (_, { rejectWithValue }) => {
    try {
      // 🟢 FIXED: Added /users/ prefix
      const response = await api.delete("/users/wishlist/clear");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear wishlist",
      );
    }
  },
);

// ==========================================
// 2. REDUX SLICE SETUP
// ==========================================

const initialState = {
  wishlist: [],
  status: "idle",
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearLocalWishlist: (state) => {
      state.wishlist = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- FETCH WISHLIST ---
      .addCase(fetchWishlistAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWishlistAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        // 🟢 DATA SHAPE FIX: Digs the array out of the backend object
        state.wishlist =
          action.payload?.items ||
          action.payload?.wishlist ||
          action.payload ||
          [];
      })
      .addCase(fetchWishlistAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // --- ADD / REMOVE / CLEAR MATCHERS ---
      // This automatically updates the UI when any wishlist action succeeds
      
      .addMatcher(
        (action) =>
          action.type.endsWith("/fulfilled") &&
          action.type.startsWith("wishlist/"),
        (state, action) => {
          if (action.type !== fetchWishlistAsync.fulfilled.type) {
            state.wishlist =
              action.payload?.items || //{items: [ { id: 1 }, { id: 2 } ]}
              action.payload?.wishlist || //{wishlist: [ { id: 1 }, { id: 2 } ]}
              action.payload || //[ { id: 1 }, { id: 2 } ]
              []; //null / undefined
          }
        },
      );
  },
});

export const { clearLocalWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;


// Fetching the wishlist doesn't need any input from the component
// It just says "hey server, give me the wishlist"
// The server already knows which user from the auth token/cookie
// _ is just a convention meaning "I'm ignoring this argument"

// Without Redux:
// ─────────────
// Navbar (♥ count)     → API call
// Wishlist Page        → API call
// Product Page         → API call
// (all same data, 3 separate calls!)

// With Redux:
// ───────────
// App loads → 1 API call → Redux stores wishlist
// Navbar           → reads Redux ⚡
// Wishlist Page    → reads Redux ⚡
// Product Page     → reads Redux ⚡
// (1 call, used everywhere!)

// User adds item
//       ↓
// Redux updates instantly ⚡ (UI feels fast)
//       +
// API call to DB in background 🔄
//       ↓
// DB confirms → Redux stays in sync ✅


// const wishlistSlice = createSlice({
//   name: "wishlist", // slice name
//   initialState, // starting data
//   reducers: {}, // sync actions
//   extraReducers: {}, // async actions (API calls)
// });


// Stage	What happens	Need data?
// pending	  order placed	❌ no data
// fulfilled	food arrived	✅ need data
// rejected	  order failed	✅ need error


// why fetchWishlist is separate?
// Because fetch is different from others
// 🟢 1. Fetch needs loading + error handling

// wishlist/addToWishlistAsync/fulfilled ✅
// wishlist/removeWishlistAsync/fulfilled ✅
// wishlist/fetchWishlistAsync/fulfilled ✅
// wishlist/addToWishlistAsync/pending ❌
// wishlist/addToWishlistAsync/rejected ❌
     

// createAsyncThunk("wishlist/addToWishlistAsync", async () => {});
// It automatically creates 3 action types:
// wishlist/addToWishlistAsync/pending
// wishlist/addToWishlistAsync/fulfilled
// wishlist/addToWishlistAsync/rejected