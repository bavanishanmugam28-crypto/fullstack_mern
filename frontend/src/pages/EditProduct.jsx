import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// ✅ Change 1: Use the Async version
import { updateProductAsync } from "../features/products/productSlice";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Change 2: Match using string ID (MongoDB doesn't use Numbers)
  const product = useSelector((state) =>
    state.products.products.find((p) => (p._id || p.id) === id)
  );

  // Initializing state with empty strings to avoid "undefined" errors
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  // Sync state when product is found
  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Change 3: Dispatch updateProductAsync with MongoDB _id
    dispatch(
      updateProductAsync({
        _id: product._id, // Send the database ID
        name,
        price: Number(price), // Ensure price is a number for the DB
        image,
        category: product.category
      })
    );

    navigate("/admin"); // Redirect back to admin console
  };

  if (!product) return <div className="container mt-5"><h3>Loading product data...</h3></div>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Edit Product</h3>

      <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
        <label className="small fw-bold">Product Name</label>
        <input
          className="form-control mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label className="small fw-bold">Price (INR)</label>
        <input
          className="form-control mb-3"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <label className="small fw-bold">Image URL</label>
        <input
          className="form-control mb-3"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            Update Product
          </button>
          <button 
            type="button" 
            className="btn btn-outline-secondary" 
            onClick={() => navigate("/admin")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;