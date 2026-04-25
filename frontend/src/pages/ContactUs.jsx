import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

function ContactUs() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="contact-page-wrapper">
      <style>{`
        .contact-page-wrapper {
          background: radial-gradient(circle at top right, #1a1a2e, #121212);
          color: #ffffff;
          min-height: 100vh;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          padding-top: 80px;
        }

        .purpose-tag {
          font-size: 0.85rem;
          letter-spacing: 0.2rem;
          text-transform: uppercase;
          color: #0dcaf0;
          font-weight: 700;
          margin-bottom: 1rem;
          display: block;
        }

        .main-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          background: linear-gradient(to bottom, #ffffff 30%, #a3a3a3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 3rem;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          backdrop-filter: blur(20px);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .info-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(13, 202, 240, 0.4);
        }

        .icon-box {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .glass-input {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white !important;
          border-radius: 12px;
          padding: 12px 16px;
          transition: all 0.3s ease;
        }

        .glass-input:focus {
          background: rgba(0, 0, 0, 0.4);
          border-color: #0dcaf0;
          box-shadow: 0 0 0 4px rgba(13, 202, 240, 0.1);
          outline: none;
        }

        .submit-btn {
          background: #ffffff;
          color: #000000;
          border: none;
          padding: 14px 35px;
          border-radius: 100px;
          font-weight: 700;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .submit-btn:hover {
          transform: scale(1.02);
          background: #0dcaf0;
          color: #ffffff;
        }

        .back-link {
          color: #a3a3a3;
          text-decoration: none;
          transition: color 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        }

        .back-link:hover {
          color: #0dcaf0;
        }

        label {
          color: #a3a3a3;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 8px;
        }
      `}</style>

      <div className="container pb-5 animate-fade-in text-center">
        {/* --- HEADER --- */}
        <span className="purpose-tag">Contact Us</span>
        <h1 className="main-title">We're here to help.</h1>

        {/* --- INFO CARDS --- */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="glass-card info-card p-4 h-100">
              <div className="icon-box">
                <Mail size={24} className="text-info" />
              </div>
              <h5 className="fw-bold mb-2">Email Us</h5>
              <p style={{ color: "#a3a3a3", fontSize: "0.9rem" }}>
                General Support
              </p>
              <a
                href="mailto:support@happieshop.com"
                className="text-info text-decoration-none fw-bold"
              >
                support@happieshop.com
              </a>
            </div>
          </div>

          <div className="col-md-4">
            <div className="glass-card info-card p-4 h-100">
              <div className="icon-box">
                <Phone size={24} className="text-success" />
              </div>
              <h5 className="fw-bold mb-2">Call Us</h5>
              <p style={{ color: "#a3a3a3", fontSize: "0.9rem" }}>
                Mon-Fri, 9am - 6pm
              </p>
              <a
                href="tel:+919876543210"
                className="text-success text-decoration-none fw-bold"
              >
                +91 9876543210
              </a>
            </div>
          </div>

          <div className="col-md-4">
            <div className="glass-card info-card p-4 h-100">
              <div className="icon-box">
                <MapPin size={24} className="text-warning" />
              </div>
              <h5 className="fw-bold mb-2">Visit Us</h5>
              <p style={{ color: "#a3a3a3", fontSize: "0.9rem" }}>
                HQ Location
              </p>
              <span className="text-warning fw-bold">City, India</span>
            </div>
          </div>
        </div>

        {/* --- FORM SECTION --- */}
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="glass-card p-5 text-start">
              {isSubmitted ? (
                <div className="text-center py-4">
                  <CheckCircle
                    size={60}
                    className="text-success mb-3 mx-auto"
                  />
                  <h3 className="fw-bold">Message Sent</h3>
                  <p style={{ color: "#a3a3a3" }}>
                    We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label>Full Name</label>
                      <input
                        type="text"
                        className="form-control glass-input"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Email Address</label>
                      <input
                        type="email"
                        className="form-control glass-input"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label>Subject</label>
                      <input
                        type="text"
                        className="form-control glass-input"
                        placeholder="How can we help?"
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label>Message</label>
                      <textarea
                        className="form-control glass-input"
                        rows="5"
                        placeholder="Your message..."
                        required
                      ></textarea>
                    </div>
                    <div className="col-12 text-center mt-5">
                      <button type="submit" className="submit-btn">
                        Send Message <Send size={18} />
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* --- BACK TO STORE LINK --- */}
        <div className="mt-5 pt-4">
          <Link to="/products" className="back-link">
            <ArrowLeft size={18} /> Back to Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
