import React from "react";
import { Link } from "react-router-dom"; // Assuming you use react-router

function Footer() {
  return (
    <footer className="bg-dark text-white mt-5 pt-5 pb-3">
      <div className="container">
        <div className="row">
          {/* Brand Section */}
          <div className="col-md-4 mb-4">
            <h5 className="text-uppercase fw-bold">Happieshop</h5>
            <p className="text-muted">
              Your one-stop shop for fashion, electronics, groceries, and more!
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h5 className="text-uppercase fw-bold">ABOUT</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-white-50 text-decoration-none">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/products"
                  className="text-white-50 text-decoration-none"
                >
                  Products
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/wishlist"
                  className="text-white-50 text-decoration-none"
                >
                  Wishlist
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/cart" className="text-white-50 text-decoration-none">
                  Cart
                </Link>
              </li>
              {/* ✅ NEW VISION & MISSION LINK ADDED BELOW */}
              <li className="mb-2">
                <Link
                  to="/vision-mission"
                  className="text-white-50 text-decoration-none"
                >
                  Vision & Mission
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="col-md-4 mb-4">
            <h5 className="text-uppercase fw-bold">HELP</h5>
            <ul className="list-unstyled text-white-50">
              <li className="mb-2">
                <Link
                  to="/contact"
                  className="text-white-50 text-decoration-none"
                >
                  Contact Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/faq" className="text-white-50 text-decoration-none">
                  FAQ
                </Link>
              </li>
            </ul>
          
          </div>
        </div>

        <hr className="border-secondary" />

        <div className="row mt-3">
          <div className="col text-center">
            <p className="text-white-50 small">
              &copy; {new Date().getFullYear()} Happieshop. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
