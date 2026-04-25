const fs = require('fs');
const { MongoClient } = require('mongodb');

// Your MongoDB Atlas URI
const uri = "mongodb://rootuser:root123@ac-ild8hux-shard-00-00.qdec7mz.mongodb.net:27017,ac-ild8hux-shard-00-01.qdec7mz.mongodb.net:27017,ac-ild8hux-shard-00-02.qdec7mz.mongodb.net:27017/ecommerce?ssl=true&replicaSet=atlas-7dcldz-shard-0&authSource=admin&retryWrites=true&w=majority"; 

async function importData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('ecommerce'); 
    const collection = database.collection('products');

    console.log("Reading JSON file...");
    
    // Using your EXACT path with the 's' in products.json!
    const exactPath = "C:\\Users\\bavan\\Documents\\project\\ecommerence\\backend\\products.json";
    
    const rawData = fs.readFileSync(exactPath); 
    const products = JSON.parse(rawData);
    
    console.log("Importing to MongoDB Atlas...");
    const result = await collection.insertMany(products);
    
    console.log(`✅ Success! ${result.insertedCount} products were imported into the 'ecommerce' database.`);
  } catch (error) {
    console.error("❌ Error importing data:", error);
  } finally {
    await client.close();
  }
}

importData();