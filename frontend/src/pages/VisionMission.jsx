import React from "react";
import { Link } from "react-router-dom";
import { Target, Eye, Rocket, Shield, Zap, ArrowRight } from "lucide-react";

function VisionMission() {
  return (
    <div className="vision-mission-wrapper">
      <style>{`
        .vision-mission-wrapper {
          background: radial-gradient(circle at top right, #1a1a2e, #121212);
          color: #ffffff;
          min-height: 100vh;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          overflow-x: hidden;
        }

        .hero-section {
          padding: 100px 0 60px;
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
          margin-bottom: 1.5rem;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          backdrop-filter: blur(20px);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .glass-card:hover {
          transform: translateY(-10px);
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(13, 202, 240, 0.4);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .icon-box {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .value-card {
          padding: 40px;
          text-align: left;
        }

        .value-card h5 {
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .value-card p {
          color: #a3a3a3;
          line-height: 1.6;
        }

        .cta-button {
          background: #ffffff;
          color: #000000;
          border: none;
          padding: 18px 40px;
          border-radius: 100px;
          font-weight: 700;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .cta-button:hover {
          transform: scale(1.05);
          background: #0dcaf0;
          color: #ffffff;
        }

        .section-divider {
          width: 60px;
          height: 4px;
          background: #0dcaf0;
          border-radius: 2px;
          margin: 2rem auto;
        }
      `}</style>

      <div className="container hero-section text-center">
        <span className="purpose-tag">Our Purpose</span>
        <h1 className="main-title">
          Defining the future of <br />
          Inventory Management.
        </h1>
        <div className="section-divider"></div>
      </div>

      <div className="container pb-5">
        {/* --- VISION & MISSION --- */}
        <div className="row g-4 mb-5 justify-content-center">
          <div className="col-lg-5">
            <div className="glass-card p-5 h-100">
              <div className="icon-box">
                <Eye size={40} color="#0dcaf0" />
              </div>
              <h3 className="fw-bold mb-4">Our Vision</h3>
              <p
                className="fs-5 text-secondary"
                style={{ color: "#a3a3a3 !important" }}
              >
                To create a seamless digital ecosystem where businesses of all
                sizes gain absolute clarity, enabling them to scale without
                technological friction.
              </p>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="glass-card p-5 h-100">
              <div className="icon-box">
                <Target size={40} color="#ffc107" />
              </div>
              <h3 className="fw-bold mb-4">Our Mission</h3>
              <p
                className="fs-5 text-secondary"
                style={{ color: "#a3a3a3 !important" }}
              >
                We build high-performance solutions that eliminate guesswork.
                Bridging the gap between raw data and actionable insights for
                every user.
              </p>
            </div>
          </div>
        </div>

        {/* --- CORE VALUES --- */}
        <div className="text-center my-5 pt-5">
          <h2 className="fw-bold">The principles that guide us.</h2>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="glass-card value-card">
              <Rocket size={32} className="text-info mb-3" />
              <h5>Innovation First</h5>
              <p>
                We push boundaries. Good enough isn't in our vocabulary—we
                iterate until it's perfect.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="glass-card value-card">
              <Shield size={32} className="text-success mb-3" />
              <h5>Absolute Integrity</h5>
              <p>
                Your data is your business. We treat security with
                uncompromising, world-class respect.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="glass-card value-card">
              <Zap size={32} className="text-warning mb-3" />
              <h5>Pure Simplicity</h5>
              <p>
                Complexity belongs in the backend. We ensure your experience is
                frictionless and beautiful.
              </p>
            </div>
          </div>
        </div>

        {/* --- CTA --- */}
        <div className="text-center mt-5 pt-5">
          <div className="py-5">
            <h4 className="mb-4 fw-light">
              Ready to experience the difference?
            </h4>
            <Link to="/products" className="cta-button">
              Explore Store <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VisionMission;
