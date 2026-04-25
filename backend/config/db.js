const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // No need for deprecated options like useNewUrlParser in newer Mongoose versions
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
