import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// ✅ Imports
import { setUser as setAuthUser } from "./features/auth/authSlice";
import { fetchCartAsync } from "./features/cart/cartSlice";
import { fetchWishlistAsync } from "./features/wishlist/wishlistSlice";

import "./style.css";

import Navbar from "./components/Navbar";
// 🚨 ADD THIS IMPORT LINE HERE:
import TopBanner from "./components/TopBanner";

import Products from "./pages/Products";
import CategoryPage from "./pages/CategoryPage";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Thankyou from "./pages/Thankyou";
import Admin from "./pages/Admin";
import EditProduct from "./pages/EditProduct";
import Footer from "./components/Footer";
import ProfilePage from "./pages/ProfilePage";
import Orders from "./pages/Orders";
import AdminRecentOrders from "./pages/AdminRecentOrders";
import VisionMission from "./pages/VisionMission";
import ContactUs from "./pages/ContactUs";
import FAQ from "./pages/FAQ";

// ✅ Layout Component (Fixed to include TopBanner)
function MainLayout() {
  return (
    <>
      {/* ⚡ The Banner goes at the very top of the layout */}
      <TopBanner />
      <Navbar />
      <div
        className="main-content"
        style={{ minHeight: "80vh", paddingTop: "20px" }} // Reduced padding since Banner adds height
      >
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

function App() {
  const dispatch = useDispatch();

  const { user, isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (storedUser) {
      dispatch(setAuthUser(storedUser));
      dispatch(fetchCartAsync());
      dispatch(fetchWishlistAsync());
    }
  }, [dispatch]);

  

  const isAdmin =
    isLoggedIn && (user?.role === "admin" || user?.email === "admin@gmail.com");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/products" />} />
          <Route path="products" element={<Products />} />
          <Route path="category/:category" element={<CategoryPage />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment" element={<Payment />} />
          <Route path="thanks" element={<Thankyou />} />
          <Route path="vision-mission" element={<VisionMission />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="faq" element={<FAQ />} />

          <Route
            path="profile"
            element={
              isLoggedIn && !isAdmin ? (
                <ProfilePage />
              ) : (
                <Navigate to={isAdmin ? "/admin" : "/login"} />
              )
            }
          />

          <Route
            path="orders"
            element={
              isAdmin ? (
                <AdminRecentOrders />
              ) : isLoggedIn ? (
                <Orders />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="admin"
            element={isAdmin ? <Admin /> : <Navigate to="/login" />}
          />
          <Route
            path="edit-product/:id"
            element={isAdmin ? <EditProduct /> : <Navigate to="/login" />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/products" />} />
      </Routes>
    </Router>
  );
}

export default App;
