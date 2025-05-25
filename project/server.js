const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const axios = require("axios");
require("dotenv").config();
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());
const translateWeather = (desc) => {
  const translations = {
    "clear sky": "Langit cerah",
    "few clouds": "Sedikit berawan",
    "scattered clouds": "Awan tersebar",
    "broken clouds": "Awan pecah",
    "overcast clouds": "Mendung",
    "shower rain": "Hujan gerimis",
    "light rain": "Hujan ringan",
    "moderate rain": "Hujan sedang",
    "heavy rain": "Hujan lebat",
    "thunderstorm": "Badai petir",
    "overcast clouds": "awan mendung",
    "mist": "Kabut"
  };
  return translations[desc.toLowerCase()] || desc;
};
(async () => {
  const db = await connectDB();
  console.log("✅ Database terkoneksi!");
  const reportsCollection = db.collection("reports");
  console.log("✅ Koleksi 'reports' siap digunakan!");
  // Ambil semua laporan
  app.get("/reports", async (req, res) => {
    try {
      const reports = await reportsCollection.find().toArray();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil laporan", details: error.message });
    }
  });

  // Tambah laporan baru
  app.post("/reports", async (req, res) => {
    const { title, description, latitude, longitude } = req.body;
    if (!title || latitude == null || longitude == null) {
      return res.status(400).json({ error: "Data tidak lengkap!" });
    }

    const newReport = {
      title,
      description: description || "",
      latitude,
      longitude,
      createdAt: new Date(),
    };

    try {
      const result = await reportsCollection.insertOne(newReport);
      res.json({
        message: "Laporan berhasil dikirim!",
        report: { _id: result.insertedId, ...newReport },
      });
    } catch (error) {
      res.status(500).json({ error: "Gagal menambahkan laporan", details: error.message });
    }
  });

  // Endpoint untuk mendapatkan cuaca berdasarkan koordinat
  app.get("/weather", async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: "Latitude dan Longitude diperlukan!" });
    }

    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;

    try {
      const response = await axios.get(weatherApiUrl);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil data cuaca", details: error.message });
    }
    
  });

  app.listen(port, () => {
    console.log(`✅ Server berjalan di http://localhost:${port}`);
  });
})();
