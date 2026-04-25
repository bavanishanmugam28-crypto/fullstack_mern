const User = require("../models/User");

// @desc    Get all orders across all users
// @route   GET /api/admin/orders
exports.getRecentOrders = async (req, res) => {
  try {
    const allOrders = await User.aggregate([
      // 1. Find users who actually have an orders array
      {
        $match: {
          orders: { $exists: true, $type: "array", $not: { $size: 0 } },
        },
      },
      // 2. Deconstruct the orders array (one document per order)
      { $unwind: "$orders" },
      // 3. Sort by date (newest first)
      { $sort: { "orders.date": -1 } },
      // 4. Map the fields to match your Frontend Table
      {
        $project: {
          _id: 0,
          orderId: "$orders.orderId",
          userEmail: "$email",
          customerName: "$orders.customerName",
          date: "$orders.date",
          totalAmount: "$orders.totalAmount",
          status: "$orders.status",
          paymentMethod: "$orders.paymentMethod",
          shippingAddress: "$orders.shippingAddress",
        },
      },
    ]);

    res.status(200).json(allOrders || []);
  } catch (error) {
    console.error("Admin Controller Error:", error);
    res.status(500).json({ message: "Server error fetching orders" });
  }
};
