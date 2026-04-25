import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductAsync,
  deleteProductAsync,
  updateProductAsync,
} from "../features/products/productSlice";
import {
  LayoutDashboard,
  PlusCircle,
  Pencil,
  Trash2,
  XCircle,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Search,
  BarChart3,
} from "lucide-react";
// 📊 Import your new chart component
import RevenueChart from "../components/RevenueChart";


function Admin() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [product, setProduct] = useState({
    _id: null,
    name: "",
    price: "",
    image: "",
    category: "General",
  });
  const [editing, setEditing] = useState(false);

  const filteredProducts = products.filter((p) =>
    (p.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      dispatch(updateProductAsync(product));
    } else {
      dispatch(addProductAsync(product));
    }
    resetForm();
  };

  const handleEdit = (p) => {
    setProduct({ ...p });
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditing(false);
    setProduct({
      _id: null,
      name: "",
      price: "",
      image: "",
      category: "General",
    });
  };

  return (
    <div className="admin-page-wrapper dark-theme-container">
      <div className="container pb-5 animate-fade-in">
        {/* --- HEADER --- */}
        <div className="d-flex justify-content-between align-items-center mb-5 pt-4">
          <div className="d-flex align-items-center gap-3">
            <div className="logo-icon bg-info bg-opacity-10 p-2 rounded-3 text-info">
              <LayoutDashboard size={28} />
            </div>
            <div>
              <h2 className="fw-bold m-0 text-white">Inventory Console</h2>
              <p className="small text-info opacity-75 m-0 uppercase-spaced">
                Control Center
              </p>
            </div>
          </div>

          <div className="search-container d-none d-md-block">
            <input
              type="text"
              className="form-control glass-input ps-5"
              placeholder="Filter by name..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              size={18}
              className="position-absolute translate-middle-y top-50 ms-3 text-muted"
            />
          </div>
        </div>

        {/* --- 📊 ANALYTICS ROW --- */}
        <div className="row g-4 mb-5">
          <div className="col-lg-8">
            <RevenueChart />
          </div>
          <div className="col-lg-4">
            <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-center">
              <div className="text-center">
                <BarChart3 size={48} className="text-info mb-3 opacity-50" />
                <h4 className="fw-bold text-white">{products.length}</h4>
                <p className="text-muted small uppercase-spaced">
                  Total SKUs in Catalog
                </p>
                <hr className="my-3 border-secondary opacity-25" />
                <h4 className="fw-bold text-success">
                  ₹
                  {products
                    .reduce((acc, p) => acc + Number(p.price), 0)
                    .toLocaleString()}
                </h4>
                <p className="text-muted small uppercase-spaced">
                  Total Inventory Value
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- ADD/EDIT FORM --- */}
        <div
          className={`glass-panel p-4 mb-5 border-start border-4 ${editing ? "border-warning" : "border-info"}`}
        >
          <div className="d-flex align-items-center gap-2 mb-4">
            <PlusCircle
              size={20}
              className={editing ? "text-warning" : "text-info"}
            />
            <h5 className="m-0 fw-bold text-white">
              {editing ? "Modify Product Listing" : "Register New Asset"}
            </h5>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="text-muted small fw-bold mb-2 d-block">
                  PRODUCT NAME
                </label>
                <input
                  className="form-control glass-input"
                  value={product.name}
                  onChange={(e) =>
                    setProduct({ ...product, name: e.target.value })
                  }
                  placeholder="e.g. Sony WH-1000XM5"
                  required
                />
              </div>

              <div className="col-md-2">
                <label className="text-muted small fw-bold mb-2 d-block">
                  PRICE (INR)
                </label>
                <input
                  className="form-control glass-input"
                  type="number"
                  value={product.price}
                  onChange={(e) =>
                    setProduct({ ...product, price: e.target.value })
                  }
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="text-muted small fw-bold mb-2 d-block">
                  IMAGE SOURCE URL
                </label>
                <div className="d-flex gap-2">
                  <input
                    className="form-control glass-input"
                    value={product.image}
                    onChange={(e) =>
                      setProduct({ ...product, image: e.target.value })
                    }
                    placeholder="https://images.unsplash.com/..."
                    required
                  />
                  <button
                    type="submit"
                    className={`btn ${editing ? "btn-warning" : "btn-info"} fw-bold px-4`}
                  >
                    {editing ? "UPDATE" : "PUBLISH"}
                  </button>
                  {editing && (
                    <button
                      type="button"
                      className="btn btn-outline-light"
                      onClick={resetForm}
                    >
                      <XCircle size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* --- PRODUCT TABLE --- */}
        <div className="glass-panel overflow-hidden border-0 shadow-lg">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 text-white border-secondary">
              <thead className="bg-dark bg-opacity-50">
                <tr>
                  <th className="px-4 py-3 opacity-50 small border-0">ASSET</th>
                  <th className="py-3 opacity-50 small border-0">
                    SPECIFICATIONS
                  </th>
                  <th className="py-3 opacity-50 small text-center border-0">
                    VALUATION
                  </th>
                  <th className="py-3 opacity-50 small text-end px-4 border-0">
                    MANAGEMENT
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr
                    key={p._id}
                    className="admin-table-row border-secondary border-opacity-10"
                  >
                    <td className="px-4">
                      <div
                        className="rounded-3 p-1 bg-white"
                        style={{ width: "50px", height: "50px" }}
                      >
                        <img
                          src={p.image}
                          alt=""
                          className="w-100 h-100 object-fit-contain"
                        />
                      </div>
                    </td>
                    <td>
                      <div className="fw-bold">{p.name}</div>
                      <div className="small text-info opacity-50">
                        SKU: {p._id.toString().slice(-8).toUpperCase()}
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-info bg-opacity-10 text-info px-3">
                        ₹{Number(p.price).toLocaleString()}
                      </span>
                    </td>
                    <td className="text-end px-4">
                      <button
                        className="btn btn-sm btn-outline-warning me-2"
                        onClick={() => handleEdit(p)}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => dispatch(deleteProductAsync(p._id))}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
