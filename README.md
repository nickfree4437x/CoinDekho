# 💰 CryptoDekho - Crypto Tracker

A sleek and responsive cryptocurrency tracker built using **React.js**, **Tailwind CSS**, **Recharts**, and **CoinGecko API**. The app shows live price data, market cap, 24h change %, and detailed price charts for the top cryptocurrencies. Includes powerful features like **search**, **filtering**, **sorting**, **bookmarking**, and **multi-currency support** (INR, USD, EUR, JPY, etc.).

---

## 🚀 Features

- 🔍 Search with Suggestions 
  Real-time search bar with dropdown suggestions.

- 📈 **Live Market Table**  
  View top 10 cryptocurrencies with price, 24h change, and market cap.

- ⭐ **Bookmark Your Favorites**  
  Toggle star icons to save favorite coins locally.

- 💹 **Detailed Coin Page**  
  Includes interactive price charts, coin metadata, and currency selector.

- 🌐 **Multi-Currency Support**  
  Supports INR, USD, EUR, JPY, and more with correct currency symbols.

- 📊 **Responsive Charting**  
  Smooth area charts using `recharts` for multiple timeframes (24h, 7d, 30d, 90d).

- 🧮 **Sorting & Filtering**  
  Sort by name, price, or market cap and apply custom filters (coming soon).

- 🧠 **Clean UI + Tailwind Styling**  
  Built with modern, glassy UI using Tailwind CSS.

---

## 🛠 Tech Stack

- **Frontend:** React.js, React Router, Tailwind CSS  
- **Charts:** Recharts  
- **Icons:** React Icons  
- **Data Source:** [CoinGecko API](https://www.coingecko.com/en/api)  
- **Backend Proxy:** Custom Express-based API (`/api/coins`, `/api/history`)  
  *(Hosted on Render.com)*


# 🔗 Live Demo
🌐 Frontend: [https://cryptodekho.vercel.app](https://coin-dekho-five.vercel.app/)  
🔗 Backend: [https://coindekho-backend.onrender.com](https://coindekho-backend.onrender.com)


## ⏰ How the Cron Job Works

To keep the data up-to-date, a cron job is set on the **backend server** which:

- Fetches live coin market data from the CoinGecko API
- Stores it in memory and serves through API routes like:
  - `/api/coins?currency=usd`
  - `/api/history/:coinId?timeframe=24h`
- Auto-updates data **every 30 minutes**
- Also, the **frontend** fetches new data at 30-minute intervals using `setInterval`

This ensures that users always see the latest prices, charts, and market caps even if the app is left idle.

---

## 📸 Screenshots

| Crypto Table | Coin Details Page |
|--------------|-------------------|

<img width="1901" height="921" alt="Screenshot (961)" src="https://github.com/user-attachments/assets/395bb387-cd77-4c43-8cf6-5a76a25eaac7" />

<img width="1902" height="916" alt="Screenshot (962)" src="https://github.com/user-attachments/assets/5499eb00-e066-416c-999a-bd534fd67c38" />

<img width="1920" height="916" alt="Screenshot (963)" src="https://github.com/user-attachments/assets/eb4de22b-0940-4165-b6db-670e229b6f51" />

<img width="1920" height="1080" alt="Screenshot (964)" src="https://github.com/user-attachments/assets/5534a62e-6153-4138-a9b0-2267524d9e39" />

---

## 🔧 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/nickfree4437x/cryptodekho.git
cd cryptodekho

2. Install Dependencies
npm install

3. Start the Development Server
npm run dev

4. Backend API
This project uses a custom backend as a proxy for CoinGecko:
/api/coins?currency=usd → returns top 10 coins
/api/history/:coinId?timeframe=24h → returns historical price data
API hosted on Render, but you can run locally or host on your own.

🌎 Deployment
You can deploy this app using:
Vercel (Recommended)
Netlify
GitHub Pages
Render (for backend)

📁 Folder Structure
css
Copy
Edit
src/
├── Components/
│   ├── CryptoTable/         # Main coin listing
│   ├── CoinChart/           # Chart and details
│   └── ...
├── App.jsx
├── index.js
└── assets/

✅ Todo
 Responsive Design
 Chart Integration
 Currency Switching
 Bookmark Toggle
 Add Pagination
 Full Filter Panel UI
 Login/Signup for saved favorites

🤝 Contribution
Pull requests are welcome!
If you have suggestions or bug reports, open an issue.

🙌 Credits
Data: CoinGecko
Icons: React Icons
Charts: Recharts

🧑‍💻 Author
Made with ❤️ by [Your Name / Vishal Saini]
📧 Email: vishalsaini5678niwarkhas@gmail.com
🔗 Portfolio • GitHub • LinkedIn
