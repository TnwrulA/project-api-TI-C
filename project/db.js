const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017/tamaDB"; 
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
    return client.db();
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
  }
}

module.exports = connectDB;
