import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom"; // ⭐ 1. Added useParams
import { setCategory, setMinPrice, setMaxPrice } from "../features/filters/filtersSlice";
import { Filter, Tag, DollarSign, Flame } from "lucide-react";

function FilterSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { category: currentCategory } = useParams(); // ⭐ 2. Get current category from URL

  const categories = [
    { label: "All Categories", value: "all" },
    { label: "Women Fashion", value: "women" },
    { label: "Men Fashion", value: "men" },
    { label: "Electronics", value: "electronics" },
    { label: "Home Decor", value: "home" },
    { label: "Footwear", value: "footwear" },
    { label: "Baby Products", value: "baby" },
    { label: "Grocery", value: "grocery" },
    { label: "Medicine", value: "medicine" },
    { label: "Fancy Items", value: "fancy" },
    { label: "Stationary", value: "stationary" },
  ];

  // ⭐ 3. Handle Category Change Logic
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    
    // Update Redux state just in case other components need it
    dispatch(setCategory(selectedCategory)); 
    
    // Actually change the URL so the page updates!
    if (selectedCategory === "all") {
      navigate("/products"); // Assuming this is your "All Products" page
    } else {
      navigate(`/category/${selectedCategory}`);
    }
  };

  return (
    <div className="filter-sidebar">
      <div className="d-flex align-items-center gap-2 mb-4">
        <Filter size={20} className="text-primary" />
        <h4 className="m-0 fw-bold">Filters</h4>
      </div>

      {/* Category Selection */}
      <div className="filter-group mb-3">
        <label className="filter-label">
          <Tag size={14} /> Category
        </label>
        <select
          className="form-select filter-input"
          value={currentCategory || "all"} // ⭐ 4. Dropdown automatically matches URL
          onChange={handleCategoryChange} // ⭐ 5. Trigger new function
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="filter-group mb-4">
        <label className="filter-label">
          <DollarSign size={14} /> Price Range
        </label>
        <div className="d-flex gap-2">
          <input
            type="number"
            className="form-control filter-input"
            placeholder="Min"
            onChange={(e) => dispatch(setMinPrice(Number(e.target.value)))}
          />
          <input
            type="number"
            className="form-control filter-input"
            placeholder="Max"
            onChange={(e) => dispatch(setMaxPrice(Number(e.target.value)))}
          />
        </div>
      </div>

      <hr className="my-4 opacity-10" />

      {/* LIVE DEALS */}
      <div className="marquee-promo-wrapper mb-4">
        <div className="marquee-header mb-2">
          <Flame size={16} className="text-danger" />
          <span className="fw-bold small ms-1">LIVE DEALS</span>
        </div>

        <div className="custom-marquee-container">
          <div className="custom-marquee-text">
            Hurry up!!! Amazing deals available now 🔥 • 50% OFF on Electronics
            💻 • New Fashion Arrivals 👗 • Free Shipping 🚀 • Hurry up!!!
            Amazing deals available now 🔥 • 50% OFF on Electronics 💻 • New
            Fashion Arrivals 👗 • Free Shipping 🚀
          </div>
        </div>
      </div>

      {/* ⭐ Clickable Offer Images */}
      <div className="promo-container">
        <div
          className="promo-card mb-3"
          onClick={() => navigate("/category/men")}
          style={{ cursor: "pointer" }}
        >
          <img
            src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200"
            alt="offer1"
            className="promo-img rounded"
          />
          <div className="promo-tag">New</div>
        </div>

        <div
          className="promo-card mb-3"
          onClick={() => navigate("/category/women")}
          style={{ cursor: "pointer" }}
        >
          <img
            src="https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=1200"
            alt="offer2"
            className="promo-img rounded"
          />
        </div>

        <div
          className="promo-card"
          onClick={() => navigate("/category/medicine")}
          style={{ cursor: "pointer" }}
        >
          <img
            src="https://cdn.shopify.com/s/files/1/0654/3504/2039/files/D2C_Homepage_Banner_Payday-Jan_1500x800_978b3f59-75bf-4853-aeee-5f22c44f151d.jpg"
            alt="offer3"
            className="promo-img rounded"
          />
        </div>
      </div>
    </div>
  );
}

export default FilterSidebar;