const mongoose = require("mongoose");
const fs = require("fs"); // File system module
const Product = require("./models/Product");

const MONGO_URI =
  "mongodb://rootuser:root123@ac-ild8hux-shard-00-00.qdec7mz.mongodb.net:27017,ac-ild8hux-shard-00-01.qdec7mz.mongodb.net:27017,ac-ild8hux-shard-00-02.qdec7mz.mongodb.net:27017/ecommerce?ssl=true&replicaSet=atlas-7dcldz-shard-0&authSource=admin&retryWrites=true&w=majority";

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    // Read the 100 products from your JSON file
    const products = JSON.parse(fs.readFileSync("./products.json", "utf-8"));

    await Product.deleteMany();
    await Product.insertMany(products);

    console.log("✅ 100 Products Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

seedDatabase();
