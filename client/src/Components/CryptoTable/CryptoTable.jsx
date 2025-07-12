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
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.toLowerCase()}&order=market_cap_desc&per_page=10&page=1&sparkline=false`
        );
        setCoins(res.data);
      } catch (err) {
        console.error("Error fetching coins:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
    const interval = setInterval(fetchCoins, 1800000); // 30 minutes
    return () => clearInterval(interval);
  }, [currency]);

  // Enhanced search with auto-suggestions
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
    navigate(`/coin/${coin.id}`);
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
      coin.current_price < filters.priceRange[0] ||
      coin.current_price > filters.priceRange[1]
    ) {
      return false;
    }

    if (
      coin.market_cap < filters.marketCapRange[0] ||
      coin.market_cap > filters.marketCapRange[1]
    ) {
      return false;
    }

    if (filters.positiveChange && coin.price_change_percentage_24h < 0) {
      return false;
    }
    if (filters.negativeChange && coin.price_change_percentage_24h >= 0) {
      return false;
    }

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
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl mt-4 md:text-5xl font-extrabold mb-4 leading-snug">
          Top 10 Cryptocurrencies
        </h1>
        <p className="text-gray-300 text-sm mb-5">
          Explore the top 10 cryptocurrencies by market capitalization.
          <br className="hidden sm:block" />
          Sign up to track your favorites.
        </p>

        {/* Search and Filter */}
        <div className="flex flex-col items-center gap-4 mx-auto max-w-lg">
          <div className="flex w-full relative">
            <div className="relative w-full">
              <div className="bg-white rounded-md flex w-full overflow-hidden">
                <input
                  type="text"
                  placeholder="Search crypto..."
                  className="w-full px-4 py-3 text-black focus:outline-none"
                  value={search}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                <button className="bg-purple-600 text-white px-4 sm:px-6 text-sm">
                  <FaSearch />
                </button>
              </div>

              {/* Auto-suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
                  {suggestions.map((coin) => (
                    <div
                      key={coin.id}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSuggestionClick(coin)}
                    >
                      <img 
                        src={coin.image} 
                        alt={coin.name} 
                        className="w-6 h-6 mr-3" 
                      />
                      <div>
                        <div className="font-medium text-gray-900">{coin.name}</div>
                        <div className="text-sm text-gray-500">{coin.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              className="ml-2 bg-purple-600 text-white px-4 rounded-md flex items-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter className="mr-2" />
              Filter
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="w-full bg-[#2b0265] p-4 rounded-lg mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Price Range ({symbol})</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className="w-full p-2 rounded bg-[#1b014a] text-white"
                      value={filters.priceRange[0]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          priceRange: [
                            Number(e.target.value),
                            filters.priceRange[1],
                          ],
                        })
                      }
                    />
                    <span>to</span>
                    <input
                      type="number"
                      className="w-full p-2 rounded bg-[#1b014a] text-white"
                      value={filters.priceRange[1]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          priceRange: [
                            filters.priceRange[0],
                            Number(e.target.value),
                          ],
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Market Cap Range ({symbol})</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className="w-full p-2 rounded bg-[#1b014a] text-white"
                      value={filters.marketCapRange[0]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          marketCapRange: [
                            Number(e.target.value),
                            filters.marketCapRange[1],
                          ],
                        })
                      }
                    />
                    <span>to</span>
                    <input
                      type="number"
                      className="w-full p-2 rounded bg-[#1b014a] text-white"
                      value={filters.marketCapRange[1]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          marketCapRange: [
                            filters.marketCapRange[0],
                            Number(e.target.value),
                          ],
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.positiveChange}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          positiveChange: e.target.checked,
                        })
                      }
                    />
                    <span>Positive 24h %</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.negativeChange}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          negativeChange: e.target.checked,
                        })
                      }
                    />
                    <span>Negative 24h %</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end mt-4 gap-2">
                <button
                  className="px-4 py-2 bg-gray-600 rounded-md"
                  onClick={resetFilters}
                >
                  Reset
                </button>
                <button
                  className="px-4 py-2 bg-purple-600 rounded-md"
                  onClick={() => setShowFilters(false)}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="max-w-5xl mx-auto bg-[#1b014a] rounded-xl shadow-xl overflow-hidden text-sm">
        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Table Header */}
              <div className="grid grid-cols-12 bg-[#2b0265] p-3 font-medium text-gray-200 text-xs sm:text-sm">
                <div className="col-span-1">#</div>
                <div
                  className="col-span-3 cursor-pointer flex items-center"
                  onClick={() => requestSort("name")}
                >
                  Coin{" "}
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "asc" ? (
                      <FaCaretUp className="inline ml-1" />
                    ) : (
                      <FaCaretDown className="inline ml-1" />
                    ))}
                </div>
                <div
                  className="col-span-2 text-right cursor-pointer"
                  onClick={() => requestSort("current_price")}
                >
                  Price{" "}
                  {sortConfig.key === "current_price" &&
                    (sortConfig.direction === "asc" ? (
                      <FaCaretUp className="inline" />
                    ) : (
                      <FaCaretDown className="inline" />
                    ))}
                </div>
                <div
                  className="col-span-2 text-right cursor-pointer pr-4"
                  onClick={() => requestSort("price_change_percentage_24h")}
                >
                  24h %{" "}
                  {sortConfig.key === "price_change_percentage_24h" &&
                    (sortConfig.direction === "asc" ? (
                      <FaCaretUp className="inline" />
                    ) : (
                      <FaCaretDown className="inline" />
                    ))}
                </div>
                <div
                  className="col-span-2 text-right cursor-pointer pl-4"
                  onClick={() => requestSort("market_cap")}
                >
                  Market Cap{" "}
                  {sortConfig.key === "market_cap" &&
                    (sortConfig.direction === "asc" ? (
                      <FaCaretUp className="inline" />
                    ) : (
                      <FaCaretDown className="inline" />
                    ))}
                </div>
                <div className="col-span-2 text-right">Fav</div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-[#2e2a63]">
                {filteredCoins.length === 0 && (
                  <div className="p-4 text-center text-yellow-400">
                    No coins match your filters. Showing all top 10 coins.
                  </div>
                )}
                {sortedCoins.map((coin, index) => (
                  <div
                    key={coin.id}
                    className="grid grid-cols-12 p-3 hover:bg-[#331c7c] transition cursor-pointer items-center"
                    onClick={() => navigate(`/coin/${coin.id}`)}
                  >
                    <div className="col-span-1">{index + 1}</div>
                    <div className="col-span-3 flex items-center gap-3">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-6 h-6"
                      />
                      <div>
                        <div className="truncate">{coin.name}</div>
                        <div className="text-gray-400 text-xs uppercase">
                          {coin.symbol}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 text-right">
                      {symbol} {coin.current_price.toLocaleString()}
                    </div>
                    <div
                      className={`col-span-2 text-right flex items-center justify-end pr-4 ${
                        coin.price_change_percentage_24h >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {coin.price_change_percentage_24h >= 0 ? (
                        <FaCaretUp className="mr-1" />
                      ) : (
                        <FaCaretDown className="mr-1" />
                      )}
                      {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                    </div>
                    <div className="col-span-2 text-right text-gray-200 pl-4">
                      {symbol} {coin.market_cap.toLocaleString()}
                    </div>
                    <div className="col-span-2 text-right">
                      <button
                        className="text-yellow-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(coin.id);
                        }}
                      >
                        {bookmarked.includes(coin.id) ? (
                          <FaStar />
                        ) : (
                          <FaRegStar />
                        )}
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