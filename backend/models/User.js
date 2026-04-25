const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // --- Authentication & Identity ---
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },

    // --- Personal Profile Details ---
    name: {
      type: String,
      default: "",
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
    },

    // --- Active Shopping Data ---
    cart: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

    // --- Purchase History (New Field) ---
    orders: [
      {
        orderId: {
          type: String,
          required: true,
        },
        items: [
          {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            name: String,
            price: Number,
            quantity: Number,
            image: String,
          },
        ],
        totalAmount: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          default: "Processing",
          enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
        },
        paymentMethod: {
          type: String,
          default: "Online",
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    // Automatically manages 'createdAt' and 'updatedAt'
    timestamps: true,
  },
);

// Exporting the unified User model
module.exports = mongoose.model("User", userSchema);
