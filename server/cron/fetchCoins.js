const axios = require("axios");
const cron = require("node-cron");
const HistoryCoin = require("../models/HistoryCoin");

// Schedule: every hour (at minute 0)
const fetchAndSaveHistory = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/coins?currency=usd"
      );

      const formatted = data.map((coin) => ({
        coinId: coin.coinId,
        name: coin.name,
        symbol: coin.symbol,
        price: coin.price,
        marketCap: coin.marketCap,
        percentChange24h: coin.percentChange24h,
        timestamp: new Date(coin.timestamp),
      }));

      await HistoryCoin.insertMany(formatted);
      console.log("✅ [CRON] History snapshot saved:", new Date().toLocaleString());
    } catch (error) {
      console.error("❌ [CRON] Failed to save history:", error.message);
    }
  });
};

module.exports = fetchAndSaveHistory;
