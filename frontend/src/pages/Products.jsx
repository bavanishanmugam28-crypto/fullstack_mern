import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import ProductSlider from "../components/ProductSlider";
import FilterSidebar from "../components/FilterSidebar";
import { setPage, fetchProducts } from "../features/products/productSlice";

function Products() {
  const dispatch = useDispatch();

  const { products, search, page, status, error } = useSelector(
    (state) => state.products,
  );
  const { user } = useSelector((state) => state.auth);

  const filters = useSelector((state) => state.filters) || {};
  const { category = "all", minPrice = 0 } = filters;

  // 🔥 FIXED: Always fetch from MongoDB when page loads
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // ⭐ Filter Logic
  const filteredProducts = (products || []).filter((product) => {
    const productPrice = Number(product.price) || 0;
    const filterMinPrice = Number(minPrice) || 0;

    return (
      (product.name || "")
        .toLowerCase()
        .includes((search || "").toLowerCase()) &&
      (category === "all" || product.category === category) &&
      productPrice >= filterMinPrice
    );
  });

  // ⭐ Pagination Logic
  const productsPerPage = 8;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const start = (page - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(
    start,
    start + productsPerPage,
  );

  // ⏳ Loading UI (Cleaned up)
  if (status === "loading") {
    return (
      <div className="text-center mt-5 py-5 min-vh-50 d-flex flex-column justify-content-center align-items-center">
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
        ></div>
        <h4 className="mt-3 text-primary fw-bold">Fetching Products...</h4>
      </div>
    );
  }

  // ❌ Error UI (Cleaned up)
  if (status === "failed") {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center shadow-sm border-0 rounded-4 p-5">
          <h4 className="fw-bold text-danger mb-2">Connection Failed</h4>
          <p className="text-secondary mb-4">{error}</p>
          <button
            className="btn btn-outline-danger px-4 rounded-pill fw-bold"
            onClick={() => dispatch(fetchProducts())}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <ProductSlider />

      {/* ORIGINAL HEADER */}
      <h2 className="mb-4">All Products</h2>

      {/* 👤 Guest Notice */}
      {user?.role === "guest" && (
        <div className="alert alert-warning text-center shadow-sm border-0 border-start border-warning border-4 rounded-3 mb-4">
          You are browsing as a <strong>Guest</strong>. Please{" "}
          <a
            href="/login"
            className="text-warning fw-bold text-decoration-none text-decoration-underline-hover"
          >
            Login
          </a>{" "}
          to purchase products.
        </div>
      )}

      {/* ORIGINAL LAYOUT ROW */}
      <div className="row">
        {/* ORIGINAL Sidebar */}
        <div className="col-md-3">
          <FilterSidebar />
        </div>

        {/* ORIGINAL Products Grid */}
        <div className="col-md-9">
          <div className="row g-3">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                />
              ))
            ) : (
              <div
                className="text-center mt-5 py-5 bg-light rounded-4"
                style={{ border: "2px dashed #dee2e6" }}
              >
                <h4 className="text-muted fw-bold mb-2">No products found</h4>
                <p className="text-secondary mb-0">
                  Try adjusting your filters or search term.
                </p>
              </div>
            )}
          </div>

          {/* Pagination - FIXED PROP (`setPage` instead of `onPageChange`) */}
          {totalPages > 1 && (
            <div className="mt-5 d-flex justify-content-center">
              <Pagination
                totalPages={totalPages}
                currentPage={page}
                setPage={(p) => dispatch(setPage(p))}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
