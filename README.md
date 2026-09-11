# 📊 Personal Finance Dashboard (FinanceDash)

FinanceDash is an interactive, React-based web dashboard designed for tracking income, analyzing expenses, and visualizing personal finance trends in real time.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?logo=vercel)](https://finance-dash-ten-eta.vercel.app)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Tech Stack](https://img.shields.io/badge/Tech-React%2019%20%7C%20Vite-blue)
![Charts](https://img.shields.io/badge/Charts-Recharts-purple)
![State](https://img.shields.io/badge/State-Context%20API-orange)

---

## 🌐 Live Demo

Check out the live application here: **[finance-dash-ten-eta.vercel.app](https://finance-dash-ten-eta.vercel.app)**

---

## ✨ Features

- 📈 **Data Visualization & Overview**: Dynamic charts powered by Recharts displaying monthly spending trends, category-wise expense breakdowns, and overall balance.
- 💳 **Sortable & Filterable Transactions**: Full-featured financial ledger to filter, sort, and search through transaction history effortlessly.
- 🔑 **Admin / Viewer Permission Toggle**: Interactive mode switch allowing users to test "Read-only" vs "Admin Edit" permission states in the UI.
- 🧮 **Automated Metrics Engine**: Real-time calculation of critical financial metrics including savings rate and month-over-month changes.
- 📱 **Responsive Pure CSS Design**: Fully responsive across mobile, tablet, and desktop screens.

---

## 🛠️ Built With

- **Framework**: React 19
- **Build Tool**: Vite
- **Data Visualization**: Recharts
- **State Management**: React Context API
- **Styling**: Pure CSS
- **Deployment**: Vercel

---

## 📁 Project Structure

```text
FinanceDash/
├── public/                 # Static web assets & icons
├── src/
│   ├── components/         # Modular UI components
│   │   ├── Dashboard/      # Main analytics charts & card widgets
│   │   ├── Insights/       # Automated financial metrics & calculations
│   │   ├── Topbar/         # Navigation & Admin/Viewer toggle bar
│   │   └── Transactions/   # Sortable/Filterable transaction table
│   ├── context/            # Global state management (Context API)
│   ├── data.js             # Mock JSON financial dataset
│   ├── App.jsx             # Main application component
│   └── index.css           # Global stylesheet
├── vite.config.js          # Vite config settings
└── package.json            # Dependencies & build scripts

🚀 Quick Start / How to Run Locally
1. Clone the repository
git clone https://github.com/Teja-vardhan67/FinanceDash.git
cd FinanceDash

2. Install dependencies
npm install

3. Start the development server
npm run dev
Open http://localhost:5173 in your browser.

🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check out the issues page.

👤 Author
Teja Vardhan

GitHub: @Teja-vardhan67
Live App: finance-dash-ten-eta.vercel.app
