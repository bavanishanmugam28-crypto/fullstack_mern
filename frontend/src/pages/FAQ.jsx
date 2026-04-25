import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Truck,
  RefreshCw,
  CreditCard,
  Box,
} from "lucide-react";

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      icon: <Truck size={24} className="text-info" />,
      question: "How long does shipping take?",
      answer:
        "Standard shipping typically takes 3-5 business days. We also offer expedited 1-2 day shipping at checkout for an additional fee. You will receive a tracking link as soon as your order ships.",
    },
    {
      icon: <RefreshCw size={24} className="text-success" />,
      question: "What is your return policy?",
      answer:
        "We offer a hassle-free 30-day return policy. If you are not completely satisfied with your purchase, you can return it within 30 days of delivery for a full refund, provided the item is in its original condition.",
    },
    {
      icon: <CreditCard size={24} className="text-warning" />,
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and UPI. All transactions are securely encrypted to protect your personal information.",
    },
    {
      icon: <Box size={24} className="text-primary" />,
      question: "Can I track my order?",
      answer:
        "Absolutely! Once your order has been dispatched, you will receive an email with your unique tracking number. You can also track your order status directly from your Profile page.",
    },
    {
      icon: <HelpCircle size={24} className="text-danger" />,
      question: "Do you ship internationally?",
      answer:
        "Currently, we only ship domestically within the country. However, we are actively working on expanding our logistics network to support international shipping in the near future!",
    },
  ];

  return (
    <div className="faq-page-wrapper">
      <style>{`
        .faq-page-wrapper {
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

        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          backdrop-filter: blur(20px);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .faq-card {
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .faq-card:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(13, 202, 240, 0.3);
        }

        .icon-container {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: all 0.4s ease-in-out;
          opacity: 0;
        }

        .faq-answer.open {
          max-height: 300px;
          padding-top: 1.5rem;
          opacity: 1;
        }

        .answer-text {
          color: #a3a3a3;
          line-height: 1.7;
          border-left: 2px solid #0dcaf0;
          padding-left: 1.5rem;
          margin-left: 1rem;
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

        .cta-section {
          margin-top: 5rem;
          padding-top: 3rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>

      <div className="container pb-5 animate-fade-in text-center">
        {/* --- HEADER --- */}
        <span className="purpose-tag">Support Center</span>
        <h1 className="main-title">Common Questions.</h1>

        {/* --- FAQ LIST --- */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-9 text-start">
            <div className="d-flex flex-column gap-3">
              {faqData.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                  <div
                    key={index}
                    className="glass-panel p-4 faq-card"
                    onClick={() => toggleFAQ(index)}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-4">
                        <div className="icon-container">{faq.icon}</div>
                        <h5 className="fw-bold m-0">{faq.question}</h5>
                      </div>
                      <div className="text-info">
                        {isOpen ? (
                          <ChevronUp size={24} />
                        ) : (
                          <ChevronDown size={24} />
                        )}
                      </div>
                    </div>

                    <div className={`faq-answer ${isOpen ? "open" : ""}`}>
                      <p className="answer-text">{faq.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* --- FOOTER CTA --- */}
        <div className="cta-section">
          <p className="text-secondary mb-4 fs-5">Still looking for answers?</p>
          <div className="d-flex justify-content-center gap-4 flex-wrap mb-5">
            <Link
              to="/contact"
              className="btn btn-outline-light px-4 py-2"
              style={{ borderRadius: "100px", fontWeight: "600" }}
            >
              Message Support
            </Link>
            <Link
              to="/products"
              className="btn btn-info text-dark px-4 py-2 fw-bold d-flex align-items-center gap-2"
              style={{ borderRadius: "100px" }}
            >
              Continue Shopping <ArrowRight size={18} />
            </Link>
          </div>

          <Link to="/products" className="back-link">
            <ArrowLeft size={18} /> Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
