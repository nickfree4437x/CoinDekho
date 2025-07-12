import { useEffect, useState } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const CoinChart = ({ coinId, currency }) => {
  const [history, setHistory] = useState([]);
  const [coinInfo, setCoinInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("24h");
  const [priceChange, setPriceChange] = useState(0);

  const symbol =
    currency === "INR" ? "₹" :
    currency === "USD" ? "$" :
    currency === "EUR" ? "€" :
    currency === "JPY" ? "¥" :
    currency + " ";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [chartRes, infoRes] = await Promise.all([
          axios.get(`https://coindekho-backend.onrender.com/api/history/${coinId}?timeframe=${timeframe}`),
          axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`)
        ]);

        const rate = infoRes.data.market_data.current_price[currency.toLowerCase()];

        const formatted = chartRes.data.history.map((item) => ({
          time: new Date(item.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }),
          price: item.price * rate,
        }));

        if (formatted.length > 1) {
          const change = ((formatted[formatted.length - 1].price - formatted[0].price) / formatted[0].price) * 100;
          setPriceChange(change);
        }

        setHistory(formatted);
        setCoinInfo(infoRes.data);
      } catch (err) {
        console.error("Error fetching chart data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (coinId) fetchData();
  }, [coinId, timeframe, currency]);

  if (loading || !coinInfo) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <img src={coinInfo.image.large} alt={coinInfo.name} className="w-16 h-16 mx-auto" />
        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
          {coinInfo.name} ({coinInfo.symbol.toUpperCase()})
        </h2>
      </div>

      {/* Chart Section */}
      <div className="bg-gradient-to-br from-[#1f1147] to-[#362d73] p-4 sm:p-6 rounded-2xl shadow-xl border border-[#50458e]/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <div className="text-white text-lg sm:text-xl font-semibold">Price Chart</div>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
            {["24h", "7d", "30d", "90d"].map((time) => (
              <button
                key={time}
                onClick={() => setTimeframe(time)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                  timeframe === time
                    ? "bg-purple-600 text-white"
                    : "bg-[#2a1a59] text-gray-300 hover:bg-[#3c2a74]"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[300px] sm:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 10, right: 15, bottom: 10, left: 0 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8a2be2" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#1a004d" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#322c5f" />
              <XAxis dataKey="time" tick={{ fill: "#c3bff1", fontSize: 11 }} tickMargin={10} />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fill: "#c3bff1", fontSize: 11 }}
                tickFormatter={(value) => `${symbol}${value.toLocaleString()}`}
                tickMargin={10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a004d",
                  border: "1px solid #39347a",
                  borderRadius: "10px",
                  color: "#fff",
                }}
                labelStyle={{
                  color: "#c3bff1",
                  fontWeight: "bold",
                  marginBottom: "6px",
                }}
                formatter={(value) => [`${symbol}${Number(value).toLocaleString()}`, "Price"]}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#8a2be2"
                strokeWidth={3}
                fill="url(#priceGradient)"
                fillOpacity={1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Price Change */}
        <div className={`mt-4 text-right text-lg font-semibold ${
          priceChange >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {priceChange.toFixed(2)}%
        </div>
      </div>

      {/* Coin Details */}
      <div className="mt-6 sm:mt-8 bg-gradient-to-br from-[#1e1a3f] to-[#2f2961] text-white rounded-xl shadow-lg p-4 sm:p-6 border border-[#3f3b69]/50">
        <h3 className="text-lg font-semibold mb-4">Coin Details</h3>
        <div className="space-y-2 text-sm sm:text-base">
          <div className="flex justify-between border-b border-[#3f3b69] pb-2">
            <span>Market Rank</span>
            <span>{coinInfo.market_cap_rank}</span>
          </div>
          <div className="flex justify-between border-b border-[#3f3b69] pb-2">
            <span>Current Price</span>
            <span>{symbol}{coinInfo.market_data.current_price[currency.toLowerCase()]?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-b border-[#3f3b69] pb-2">
            <span>Market Cap</span>
            <span>{symbol}{coinInfo.market_data.market_cap[currency.toLowerCase()]?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-b border-[#3f3b69] pb-2">
            <span>24h Change</span>
            <span className={priceChange >= 0 ? 'text-green-400' : 'text-red-400'}>
              {priceChange.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>Last Updated</span>
            <span>{new Date(coinInfo.last_updated).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinChart;
