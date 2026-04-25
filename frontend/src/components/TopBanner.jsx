import React, { useState, useEffect } from "react";
import { Zap, Clock } from "lucide-react";

const TopBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date();
    target.setHours(23, 59, 59);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
      } else {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNum = (num) => num.toString().padStart(2, "0");

  return (
    <div className="flash-sale-banner">
      <style>{`
        .flash-sale-banner {
          background: linear-gradient(90deg, #ff416c 0%, #ff4b2b 100%);
          color: white;
          text-align: center;
          padding: 8px 0;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 15px;
          box-shadow: 0 2px 10px rgba(255, 75, 43, 0.3);
          z-index: 30; /* ✅ Updated z-index to 30 */
          position: relative;
        }
        .timer-box {
          background: rgba(0, 0, 0, 0.2);
          padding: 2px 8px;
          border-radius: 4px;
          font-family: 'Monaco', monospace;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .flash-text {
          animation: blink 1.5s infinite;
        }
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `}</style>

      <span className="flash-text d-flex align-items-center gap-1">
        <Zap size={14} fill="currentColor" /> FLASH SALE LIVE
      </span>

      <span className="d-none d-md-inline">
        Extra 20% OFF on all Electronics!
      </span>

      <div className="d-flex align-items-center gap-2">
        <Clock size={14} />
        Ends in:
        <span className="timer-box">
          {formatNum(timeLeft.hours)}:{formatNum(timeLeft.minutes)}:
          {formatNum(timeLeft.seconds)}
        </span>
      </div>
    </div>
  );
};

export default TopBanner;
