import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

// ==========================================
// ASYNC THUNKS (Talking to Node.js Backend)
// ==========================================

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/products");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);

export const addProductAsync = createAsyncThunk(
  "products/addProduct",
  async (newProduct, { rejectWithValue }) => {
    try {
      const response = await api.post("/products", newProduct);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add product",
      );
    }
  },
);

export const deleteProductAsync = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product",
      );
    }
  },
);

export const updateProductAsync = createAsyncThunk(
  "products/updateProduct",
  async (product, { rejectWithValue }) => {
    try {
      const response = await api.put(`/products/${product._id}`, product);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product",
      );
    }
  },
);

// ==========================================
// REDUX SLICE
// ==========================================

const initialState = {
  products: [],
  status: "idle",
  error: null,
  search: "",
  category: "all",
  page: 1,
  perPage: 6,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
      state.page = 1;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
      state.page = 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH PRODUCTS
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        // 🟢 THE FIX: Safely extracts the array regardless of how Node.js wraps it
        state.products =
          action.payload?.products ||
          action.payload?.data ||
          action.payload ||
          [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ADD PRODUCT
      .addCase(addProductAsync.fulfilled, (state, action) => {
        const newProduct = action.payload?.product || action.payload;
        if (newProduct) state.products.push(newProduct);
      })

      // DELETE PRODUCT
      .addCase(deleteProductAsync.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product._id !== action.payload,
        );
      })

      // UPDATE PRODUCT
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        const updatedProduct = action.payload?.product || action.payload;
        const index = state.products.findIndex(
          (p) => p._id === updatedProduct._id,
        );
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
      });
  },
});

export const { setSearch, setCategory, setPage } = productSlice.actions;
export default productSlice.reducer;

// Why reset page?
// Imagine:
// You are on page 5
// Then you search "shoes"
// 👉 Page 5 may not exist for "shoes"
// So state.page = 1
// ✔ Always start fresh

// Check position 0 → p._id = "1" === "2"? ❌ No
// Check position 1 → p._id = "2" === "2"? ✅ Yes! Stop here
// returns 1

// findIndex returns:
// -1 = "NOT found in list"
//  0 = "found at position 0"
//  1 = "found at position 1"

// So index !== -1 simply means:
// "only update IF we found it"
