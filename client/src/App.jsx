import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import CryptoTable from "./Components/CryptoTable/CryptoTable";
import CoinDetail from "./Pages/CoinDetail"; // Detail page
import Footer from "./Components/Footer/Footer";

function App() {
  const [currency, setCurrency] = useState("INR");

  return (
    <div className="min-h-screen bg-[#0a0033] text-white">
      {/* Navbar stays on all pages */}
      <Navbar currency={currency} setCurrency={setCurrency} />

      {/* Route definitions */}
      <Routes>
        <Route
          path="/"
          element={<CryptoTable currency={currency} />}
        />
        <Route
          path="/coin/:coinId"
          element={<CoinDetail currency={currency} />}
        />
      </Routes>

      <Footer/>
    </div>
  );
}

export default App;
