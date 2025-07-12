import { useState } from "react";
import { FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import { FaCoins } from "react-icons/fa6";

const currencies = ["USD", "EUR", "INR", "GBP", "JPY"];

const Navbar = ({ currency, setCurrency }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCurrencySelect = (selected) => {
    setCurrency(selected);
    setIsDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) setIsDropdownOpen(false);
  };

  return (
    <div className="relative z-50">
      <nav className="bg-gradient-to-r from-[#0a0033] to-[#1a0a5e] text-white px-4 md:px-12 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between relative">
          {/* Left: Logo + Currency (mobile) */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center no-underline gap-2 z-50">
              <FaCoins className="text-white text-3xl animate-pulse" />
              <span className="text-2xl font-bold tracking-wide bg-clip-text text-transparent bg-white">
                CoinDekho
              </span>
            </Link>

            {/* Currency Dropdown - Mobile only */}
            <div className="md:hidden relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-16 px-2 py-1 border border-yellow-400 bg-transparent text-white text-xs rounded-full hover:bg-blue-400 hover:text-[#0a0033] transition duration-300"
              >
                {currency}
                <FaChevronDown
                  size={10}
                  className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute z-30 top-full left-0 mt-1 w-16 bg-[#1a0a5e] border border-blue-400 rounded-lg shadow-xl overflow-hidden"
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  {currencies.map((curr) => (
                    <div
                      key={curr}
                      onClick={() => handleCurrencySelect(curr)}
                      className={`w-full py-1 text-xs cursor-pointer text-center transition duration-200 ${
                        curr === currency
                          ? "bg-blue-500 text-white font-bold"
                          : "hover:bg-[#0a0033] hover:text-white"
                      }`}
                    >
                      {curr}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-2xl focus:outline-none z-50"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Center: Nav Links (visible only on md+) */}
          <ul className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-10 tex-[1rem]">
            <li><Link to="/" className="text-white no-underline hover:underline transition">Home</Link></li>
            <li><Link to="#" className="text-white no-underline hover:underline transition">Features</Link></li>
            <li><Link to="#" className="text-white no-underline hover:underline transition">Pricing</Link></li>
            <li><Link to="#" className="text-white no-underline hover:underline transition">Blog</Link></li>
          </ul>

          {/* Right: Currency Dropdown + Login (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Currency Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-20 px-3 py-2 border border-yellow-400 bg-transparent text-white text-sm rounded-full hover:bg-yellow-400 hover:text-[#0a0033] transition duration-300"
              >
                {currency}
                <FaChevronDown
                  size={12}
                  className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute z-30 top-full left-0 mt-1 w-24 bg-[#1a0a5e] border border-yellow-400 rounded-lg shadow-xl overflow-hidden"
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  {currencies.map((curr) => (
                    <div
                      key={curr}
                      onClick={() => handleCurrencySelect(curr)}
                      className={`w-full py-2 text-sm cursor-pointer text-center transition duration-200 ${
                        curr === currency
                          ? "bg-blue-500 text-white font-bold"
                          : "hover:bg-[#0a0033] hover:text-white"
                      }`}
                    >
                      {curr}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Login Button */}
            <button className="bg-white text-[#0a0033] px-4 py-2 rounded-full flex items-center gap-1 hover:bg-yellow-300 hover:shadow-lg transition duration-300">
              <span className="text-[1rem] text-sm font-semibold">Login</span> <HiArrowRight className="ml-1" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#1a0a5e] px-6 py-4 shadow-xl border-t border-yellow-400">
            <ul className="flex flex-col gap-4 mb-6">
              <li><Link to="/" className="block py-2 text-white no-underline hover:underline transition" onClick={toggleMobileMenu}>Home</Link></li>
              <li><Link to="#" className="block py-2 text-white no-underline hover:underline transition" onClick={toggleMobileMenu}>Features</Link></li>
              <li><Link to="#" className="block py-2 text-white no-underline hover:underline transition" onClick={toggleMobileMenu}>Pricing</Link></li>
              <li><Link to="#" className="block py-2 text-white no-underline hover:underline transition" onClick={toggleMobileMenu}>Blog</Link></li>
            </ul>

            <button 
              className="w-full bg-white text-[#0a0033] py-3 rounded-full flex items-center justify-center gap-1 text-[1rem] text-sm font-semibold hover:bg-yellow-300 transition duration-300"
              onClick={toggleMobileMenu}
            >
              Login <HiArrowRight className="ml-1" />
            </button>
          </div>
        )}
      </nav>

      {/* Clean Border Under Navbar Without Extra Margin */}
      <div className="h-[1px] bg-gray-400 w-full" />
    </div>
  );
};

export default Navbar;