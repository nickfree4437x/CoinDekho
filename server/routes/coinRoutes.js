const express = require("express");
const axios = require("axios");
const CurrentCoin = require("../models/CurrentCoin");
const HistoryCoin = require("../models/HistoryCoin");

const router = express.Router();

// 🧠 In-memory cache
let cache = {
  data: null,
  timestamp: null,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// ✅ GET /api/coins - Cached Fetch from CoinGecko
router.get("/coins", async (req, res) => {
  const currency = req.query.currency || "usd";
  const now = Date.now();

  try {
    // 🧠 Use cached data if valid
    if (cache.data && (now - cache.timestamp < CACHE_DURATION)) {
      return res.status(200).json(cache.data);
    }

    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets`,
      {
        params: {
          vs_currency: currency.toLowerCase(),
          order: "market_cap_desc",
          per_page: 10,
          page: 1,
        },
      }
    );

    const formatted = data.map((coin) => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.current_price,
      marketCap: coin.market_cap,
      percentChange24h: coin.price_change_percentage_24h,
      timestamp: coin.last_updated,
    }));

    // 🧹 Clear old data & save new
    await CurrentCoin.deleteMany();
    await CurrentCoin.insertMany(formatted);

    // 🧠 Update cache
    cache = {
      data: formatted,
      timestamp: now,
    };

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Error fetching from CoinGecko:", err.message);
    res.status(500).json({ error: "Failed to fetch and save coins" });
  }
});

// ✅ POST /api/history - Save current snapshot into history
router.post("/history", async (req, res) => {
  try {
    const currentCoins = await CurrentCoin.find();

    const historyData = currentCoins.map((coin) => ({
      coinId: coin.coinId,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.price,
      marketCap: coin.marketCap,
      percentChange24h: coin.percentChange24h,
      timestamp: coin.timestamp,
    }));

    await HistoryCoin.insertMany(historyData);

    res.status(201).json({ message: "Snapshot saved to history" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to save history" });
  }
});

// ✅ GET /api/history/:coinId - Get chart data + latest coin detail
router.get("/history/:coinId", async (req, res) => {
  try {
    const { coinId } = req.params;

    const history = await HistoryCoin.find({ coinId }).sort({ timestamp: 1 });

    if (!history.length) {
      return res.status(404).json({ message: "Coin not found." });
    }

    const latest = history[history.length - 1];

    const coinDetails = {
      coinId: latest.coinId,
      name: latest.name,
      symbol: latest.symbol,
      price: latest.price,
      marketCap: latest.marketCap,
      percentChange24h: latest.percentChange24h,
      timestamp: latest.timestamp,
    };

    res.status(200).json({ history, coinDetails });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;
