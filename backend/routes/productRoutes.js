const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// 🟢 Matches: GET http://localhost:5000/api/products
router.get("/", productController.getProducts);

// 🔍 Matches: GET http://localhost:5000/api/products/:id
router.get("/:id", productController.getProductById);

router.put("/:id", productController.updateProduct);

module.exports = router;
