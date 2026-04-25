import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import productsReducer from "../features/products/productSlice";
import authReducer from "../features/auth/authSlice";
import filtersReducer from "../features/filters/filtersSlice";  // ⭐ add this

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productsReducer,
    wishlist: wishlistReducer,
    filters: filtersReducer   // ⭐ add this
  }
});