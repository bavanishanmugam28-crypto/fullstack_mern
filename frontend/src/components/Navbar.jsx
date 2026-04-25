import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// ✅ CLEANED UP: Only one import for Lucide icons
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Mic,
  LogOut,
  LayoutDashboard,
  Package,
  ChevronDown,
  Menu,
} from "lucide-react";

// ✅ Auth & Cart Actions
import { logout } from "../features/auth/authSlice";
import { clearLocalCart } from "../features/cart/cartSlice";
import { clearLocalWishlist } from "../features/wishlist/wishlistSlice";
import { setSearch } from "../features/products/productSlice";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) => state.cart?.cart?.length || 0);
  const wishlistCount = useSelector(
    (state) => state.wishlist?.wishlist?.length || 0,
  );

  const [searchText, setSearchText] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const isAdmin = user?.email === "admin@gmail.com";

  const categories = [
    "Women",
    "Men",
    "Electronics",
    "Home",
    "Footwear",
    "Medicine",
    "Baby",
    "Fancy",
    "Stationary",
    "Grocery",
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearch(searchText));
    if (location.pathname !== "/products") navigate("/products");
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice search is not supported in this browser. Please use Chrome.",
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false; // ✅ Added: Stops listening once you finish speaking
    recognition.interimResults = false; // ✅ Added: Only gives final result

    recognition.onstart = () => {
      console.log("Listening now... speak into your mic.");
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "not-allowed")
        alert("Please allow microphone access in your browser settings.");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchText(transcript);
      dispatch(setSearch(transcript));
      navigate(`/products?search=${encodeURIComponent(transcript)}`);
    };

    recognition.start();
  };

  const handleLogout = () => {
    dispatch(clearLocalCart());
    dispatch(clearLocalWishlist());
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header
      className={`fixed-top transition-all ${scrolled ? "nav-glass shadow-sm" : "bg-white"}`}
    >
      <nav className="navbar navbar-expand-lg py-2">
        <div className="container">
          <Link
            className="navbar-brand d-flex align-items-center gap-2"
            to="/products"
          >
            <div className="logo-icon">H</div>
            <span className="brand-text">
              Happie<span className="text-primary">Shop</span>
            </span>
          </Link>

          <div className="search-container d-none d-lg-block mx-lg-4">
            <form onSubmit={handleSearch} className="position-relative">
              <input
                type="text"
                className="search-input"
                placeholder="Search for products..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              {/* ✅ Microphone inside the main search bar */}
              <button
                type="button"
                onClick={handleVoiceSearch}
                className="btn position-absolute end-0 top-50 translate-middle-y border-0 text-muted pe-5"
                title="Voice Search"
                style={{ zIndex: 5 }}
              >
                <Mic size={18} />
              </button>
              <button type="submit" className="search-icon-btn">
                <Search size={18} />
              </button>
            </form>
          </div>

          <div className="d-flex align-items-center gap-1 gap-md-3 ms-auto ms-lg-0 order-lg-3">
            <Link to="/wishlist" className="nav-icon-link position-relative">
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="dot-badge">{wishlistCount}</span>
              )}
            </Link>

            <Link to="/cart" className="nav-icon-link position-relative me-2">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="count-badge">{cartCount}</span>
              )}
            </Link>

            <button
              className="navbar-toggler border-0 p-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navContent"
            >
              <Menu size={26} />
            </button>
          </div>

          <div
            className="collapse navbar-collapse order-lg-4 flex-grow-0"
            id="navContent"
          >
            <ul className="navbar-nav align-items-center gap-2 gap-lg-3 py-3 py-lg-0">
              {isLoggedIn ? (
                <li className="nav-item dropdown w-100">
                  <button
                    className="user-dropdown-toggle w-100"
                    data-bs-toggle="dropdown"
                  >
                    <div className="user-avatar bg-primary text-white">
                      {user?.email?.[0].toUpperCase() || "U"}
                    </div>
                    <span className="small d-lg-none ms-2">{user?.email}</span>
                    <ChevronDown size={14} className="ms-auto" />
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end custom-dropdown border-0 shadow-lg animate-fade-in">
                    {!isAdmin ? (
                      <>
                        <li>
                          <Link className="dropdown-item" to="/profile">
                            <User size={16} className="me-2" /> My Profile
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/orders">
                            <Package size={16} className="me-2" /> My Orders
                          </Link>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <Link
                            className="dropdown-item text-primary fw-bold"
                            to="/admin"
                          >
                            <LayoutDashboard size={16} className="me-2" /> Admin
                            Panel
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/orders">
                            <Package size={16} className="me-2" /> All Orders
                          </Link>
                        </li>
                      </>
                    )}
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} className="me-2" /> Logout
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <li className="nav-item d-flex gap-2 w-100 justify-content-center">
                  <Link to="/login" className="btn-login px-3">
                    Login
                  </Link>
                  <Link to="/signup" className="btn-signup px-3">
                    Sign Up
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Categories Strip */}
      <div className="category-strip d-none d-lg-block">
        <div className="container d-flex justify-content-center gap-4">
          <Link to="/products" className="strip-link fw-bold text-primary">
            All Products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/category/${cat.toLowerCase()}`}
              className="strip-link"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
