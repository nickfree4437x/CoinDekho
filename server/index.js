const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const coinRoutes = require("./routes/coinRoutes");
const fetchAndSaveHistory = require("./cron/fetchCoins"); // ✅ Cron import

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Sample test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working fine 🔥" });
});

app.use("/api", coinRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    // Start server
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
    });

    // ✅ Start Cron Job after DB is connected
    fetchAndSaveHistory();
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });
