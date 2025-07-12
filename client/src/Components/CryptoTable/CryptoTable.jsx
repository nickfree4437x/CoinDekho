import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCaretUp,
  FaCaretDown,
  FaRegStar,
  FaStar,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CryptoTable = ({ currency }) => {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [bookmarked, setBookmarked] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "market_cap",
    direction: "desc",
  });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    marketCapRange: [0, 1000000000000],
    positiveChange: false,
    negativeChange: false,
  });

  const navigate = useNavigate();

  const symbol =
    currency === "INR"
      ? "₹"
      : currency === "USD"
      ? "$"
      : currency === "EUR"
      ? "€"
      : currency === "JPY"
      ? "¥"
      : currency;

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://coindekho-backend.onrender.com/api/coins?currency=${currency.toLowerCase()}`
        );
        setCoins(res.data);
      } catch (err) {
        console.error("Error fetching coins:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
    const interval = setInterval(fetchCoins, 1800000); // 30 min
    return () => clearInterval(interval);
  }, [currency]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    const matches = coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(value.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(matches.slice(0, 5));
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (coin) => {
    setSearch("");
    setShowSuggestions(false);
    navigate(`/coin/${coin.coinId}`);
  };

  const toggleBookmark = (id) => {
    setBookmarked((prev) =>
      prev.includes(id) ? prev.filter((coinId) => coinId !== id) : [...prev, id]
    );
  };

  const requestSort = (key) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  const applyFilters = (coin) => {
    if (
      filters.priceRange[0] === 0 &&
      filters.priceRange[1] === 100000 &&
      filters.marketCapRange[0] === 0 &&
      filters.marketCapRange[1] === 1000000000000 &&
      !filters.positiveChange &&
      !filters.negativeChange
    ) {
      return true;
    }

    if (
      coin.price < filters.priceRange[0] ||
      coin.price > filters.priceRange[1]
    ) {
      return false;
    }

    if (
      coin.marketCap < filters.marketCapRange[0] ||
      coin.marketCap > filters.marketCapRange[1]
    ) {
      return false;
    }

    if (filters.positiveChange && coin.percentChange24h < 0) return false;
    if (filters.negativeChange && coin.percentChange24h >= 0) return false;

    return true;
  };

  const filteredCoins = coins.filter(applyFilters);
  const displayCoins = filteredCoins.length > 0 ? filteredCoins : coins;

  const sortedCoins = [...displayCoins].sort((a, b) => {
    if (sortConfig.key === "name" || sortConfig.key === "symbol") {
      return sortConfig.direction === "asc"
        ? a[sortConfig.key].localeCompare(b[sortConfig.key])
        : b[sortConfig.key].localeCompare(a[sortConfig.key]);
    }
    return sortConfig.direction === "asc"
      ? a[sortConfig.key] - b[sortConfig.key]
      : b[sortConfig.key] - a[sortConfig.key];
  });

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 100000],
      marketCapRange: [0, 1000000000000],
      positiveChange: false,
      negativeChange: false,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#120052] to-[#0a0033] text-white px-4 py-10">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Top 10 Cryptocurrencies</h1>
        <p className="text-gray-300 text-sm mb-4">
          Explore the top 10 cryptocurrencies by market cap. <br />
          Sign up to track your favorites.
        </p>

        <div className="relative max-w-lg mx-auto flex items-center gap-2">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search crypto..."
              className="w-full px-4 py-3 text-black rounded-md"
              value={search}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute w-full mt-1 bg-white rounded shadow z-10">
                {suggestions.map((coin) => (
                  <div
                    key={coin.coinId}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-black flex items-center gap-2"
                    onClick={() => handleSuggestionClick(coin)}
                  >
                    <img src={coin.image} alt={coin.name} className="w-5 h-5" />
                    <span>{coin.name} ({coin.symbol.toUpperCase()})</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-purple-600 px-4 py-2 rounded-md flex items-center gap-1"
          >
            <FaFilter />
            Filter
          </button>
        </div>

        {showFilters && (
          <div className="bg-[#2b0265] mt-4 p-4 rounded-md">
            {/* Filters go here (same as before) */}
            <p className="text-sm text-gray-300">Filters panel placeholder...</p>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="max-w-5xl mx-auto bg-[#1b014a] rounded-xl shadow-xl overflow-hidden text-sm">
        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              <div className="grid grid-cols-12 bg-[#2b0265] p-3 font-medium text-gray-200 text-xs sm:text-sm">
                <div className="col-span-1">#</div>
                <div className="col-span-3">Coin</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">24h %</div>
                <div className="col-span-2 text-right">Market Cap</div>
                <div className="col-span-2 text-right">Fav</div>
              </div>

              <div className="divide-y divide-[#2e2a63]">
                {sortedCoins.map((coin, index) => (
                  <div
                    key={coin.coinId}
                    className="grid grid-cols-12 p-3 hover:bg-[#331c7c] transition cursor-pointer items-center"
                    onClick={() => navigate(`/coin/${coin.coinId}`)}
                  >
                    <div className="col-span-1">{index + 1}</div>
                    <div className="col-span-3 flex items-center gap-2">
                      <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                      <span>{coin.name}</span>
                    </div>
                    <div className="col-span-2 text-right">
                      {symbol}{coin.price.toLocaleString()}
                    </div>
                    <div
                      className={`col-span-2 text-right ${
                        coin.percentChange24h >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {coin.percentChange24h?.toFixed(2)}%
                    </div>
                    <div className="col-span-2 text-right">
                      {symbol}{coin.marketCap.toLocaleString()}
                    </div>
                    <div className="col-span-2 text-right">
                      <button
                        className="text-yellow-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(coin.coinId);
                        }}
                      >
                        {bookmarked.includes(coin.coinId) ? <FaStar /> : <FaRegStar />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoTable;
