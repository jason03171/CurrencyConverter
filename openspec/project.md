# Currency Converter Project

## Project Overview
A Vue 3 + Vite-based web application for converting between currencies with real-time exchange rates.

**Repository:** https://jason03171.github.io/CurrencyConverter/

## Tech Stack
- **Frontend Framework:** Vue 3 (Composition API with `<script setup>`)
- **Build Tool:** Vite
- **HTTP Client:** Axios
- **Styling:** CSS (vanilla)
- **Package Manager:** npm
- **Node Version:** Module type (ES modules)

## Development Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure
```
CurrencyConverter/
├── src/
│   ├── App.vue          # Main component (currency converter UI)
│   ├── main.js          # Vue app initialization
│   └── style.css        # Global styles
├── public/
│   └── exchange_rate.json   # Static exchange rate data
├── package.json
├── vite.config.js
└── README.md
```

## Key Features
- Convert between multiple currencies (190+ supported)
- Fetch real-time exchange rates from ExchangeRate-API
- Smart caching with 1-hour expiry for offline support
- Automatic fallback to static JSON if API unavailable
- Manual refresh button to get latest rates
- Display of last update timestamp
- Bidirectional conversion (front/back targets)

## Code Conventions
- **Vue Composition API:** Use `<script setup>` for components
- **State Management:** Reactive objects with `reactive()` and refs with `ref()`
- **Naming:** camelCase for variables/functions, PascalCase for components
- **HTTP Requests:** Use axios for API calls with error handling
- **Localization:** Support for multiple languages (currently includes Chinese labels)

## Exchange Rate Data Format
```json
[
  {
    "currency": "新台幣 (TWD)",
    "cash_ask": "32.50"
  }
]
```

## Known Issues / TODOs
- ~~Typo in function: `setDefalut` should be `setDefault`~~ ✅ FIXED
- Consider adding more payment-related currencies from the API

## Team & Contact
- **Project Lead:** jason.lee
- **Status:** Active Development
