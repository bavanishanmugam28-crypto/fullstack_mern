import React from "react";
import { TrendingUp, Calendar, ArrowUpRight } from "lucide-react";

const RevenueChart = () => {
  // 📈 Professional 12-Month Data
  const data = [
    { label: "Jan", height: "40%", val: "₹45k" },
    { label: "Feb", height: "55%", val: "₹52k" },
    { label: "Mar", height: "48%", val: "₹48k" },
    { label: "Apr", height: "70%", val: "₹61k" },
    { label: "May", height: "85%", val: "₹75k" },
    { label: "Jun", height: "75%", val: "₹68k" },
    { label: "Jul", height: "92%", val: "₹82k" },
    { label: "Aug", height: "88%", val: "₹79k" },
    { label: "Sep", height: "78%", val: "₹71k" },
    { label: "Oct", height: "95%", val: "₹89k" },
    { label: "Nov", height: "100%", val: "₹95k" },
    { label: "Dec", height: "110%", val: "₹110k" },
  ];

  return (
    <div className="revenue-graph-card">
      <style>{`
        .revenue-graph-card {
          background: #1a1a1a; /* Dark background for high contrast */
          border-radius: 24px;
          padding: 25px;
          color: white;
          box-shadow: 0 15px 35px rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .graph-area {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          height: 200px;
          margin-top: 40px;
          position: relative;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .bar-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 6%;
          height: 100%;
          justify-content: flex-end;
          position: relative;
        }
        .bar-pill {
          width: 100%;
          background: linear-gradient(180deg, #0dcaf0 0%, rgba(13, 202, 240, 0.2) 100%);
          border-radius: 6px 6px 0 0;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
        }
        .bar-pill:hover {
          background: #ffffff;
          box-shadow: 0 0 20px rgba(13, 202, 240, 0.6);
          transform: scaleX(1.1);
        }
        .bar-pill::after {
          content: attr(data-value);
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: #0dcaf0;
          color: black;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          opacity: 0;
          transition: 0.3s;
          white-space: nowrap;
        }
        .bar-pill:hover::after {
          opacity: 1;
          top: -35px;
        }
        .label-text {
          font-size: 10px;
          color: rgba(255,255,255,0.4);
          margin-top: 10px;
          font-weight: 700;
        }
        .target-line {
          position: absolute;
          width: 100%;
          border-top: 1px dashed rgba(13, 202, 240, 0.3);
          top: 30%;
          z-index: 0;
        }
      `}</style>

      {/* Header Info */}
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <p className="text-info small fw-bold mb-1 d-flex align-items-center gap-2">
            <Calendar size={14} /> REVENUE TREND 2026
          </p>
          <h3 className="fw-bold m-0">₹12.45 Lakh</h3>
        </div>
        <div className="badge bg-success bg-opacity-10 text-success p-2 px-3 rounded-pill border border-success border-opacity-25">
          <ArrowUpRight size={16} className="me-1" /> +24%
        </div>
      </div>

      {/* The Actual Graph Area */}
      <div className="graph-area">
        <div className="target-line"></div>
        {data.map((item, index) => (
          <div key={index} className="bar-group">
            <div
              className="bar-pill"
              style={{ height: item.height }}
              data-value={item.val}
            ></div>
            <span className="label-text">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Bottom Metrics */}
      <div className="d-flex justify-content-between mt-4 pt-3 border-top border-white border-opacity-10">
        <div className="text-center">
          <p className="small text-muted mb-0">Conversion</p>
          <p className="fw-bold text-info mb-0">3.2%</p>
        </div>
        <div className="text-center">
          <p className="small text-muted mb-0">Customers</p>
          <p className="fw-bold text-white mb-0">1,240</p>
        </div>
        <div className="text-center">
          <p className="small text-muted mb-0">Avg. Order</p>
          <p className="fw-bold text-success mb-0">₹2,850</p>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
