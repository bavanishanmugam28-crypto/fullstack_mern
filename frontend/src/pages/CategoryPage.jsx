import React, { useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ Added useNavigate
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../features/products/productSlice";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";

function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate(); // ✅ Initialize navigate
  const dispatch = useDispatch();
  const pageRef = useRef(null);

  // Redux Selectors
  const { products, status, search } = useSelector((state) => state.products);
  const { minPrice, maxPrice } = useSelector((state) => state.filters);

  // 📥 Fetch products from MongoDB when the component loads
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Optimized & Crash-Proof Filtering
  const filteredProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];

    return products.filter((product) => {
      const productCategory = String(product?.category || "").toLowerCase();
      const urlCategory = String(category || "").toLowerCase();

      const productName = String(product?.name || "").toLowerCase();
      const searchTerm = (search || "").toLowerCase();

      return (
        productCategory === urlCategory &&
        productName.includes(searchTerm) &&
        product.price >= (minPrice || 0) &&
        product.price <= (maxPrice || Infinity)
      );
    });
  }, [products, category, search, minPrice, maxPrice]);

  // Scroll Behavior
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [category]);

  // 🔄 Show a loading spinner if the backend is still thinking
  if (status === "loading") {
    return (
      <div className="text-center mt-5">
        <h3>Loading Products...</h3>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="container mt-4">
      {/* 🔙 Back to Home Button */}
      <div className="mb-3">
        <button
          className="btn btn-outline-secondary btn-sm border-0 ps-0"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>
      </div>

      <h2 className="mb-4 text-capitalize">{category} Products</h2>

      <div className="row">
        <div className="col-md-3">
          <FilterSidebar />
        </div>
        <div className="col-md-9">
          <div className="row">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                />
              ))
            ) : (
              <div className="text-center mt-5">
                <h4>No products found in "{category}"</h4>
                <p className="text-muted small">
                  Check if your MongoDB collection has products with this exact
                  category name.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
