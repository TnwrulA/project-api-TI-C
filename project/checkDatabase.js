// Fungsinya untuk mengimpor class MongoClient dari pustaka mongodb
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
// Fungsinya untuk membuat fungsi async untuk mengecek daftar database
async function checkDB() {
    try {
        // Fungsinya untuk membuka koneksi ke MongoDB server
        await client.connect();
        const databases = await client.db().admin().listDatabases();
        console.log("Databases:");
        databases.databases.forEach(db => console.log(`- ${db.name}`));
    } catch (error) {
        console.error("Error checking databases:", error);
    } finally {
        await client.close();
    }
}

checkDB();
