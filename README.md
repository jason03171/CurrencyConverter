# [CurrencyConverter](https://jason03171.github.io/CurrencyConverter/)
# Vue 3 + Vite

A real-time currency converter application that fetches live exchange rates with intelligent caching and fallback mechanisms.

## Features

- ✨ **Real-time Exchange Rates** - Fetches current rates from ExchangeRate-API
- 💾 **Smart Caching** - Caches rates locally for 1 hour to reduce API calls
- 🔄 **Automatic Fallback** - Falls back to static JSON if API is unavailable
- 🔃 **Manual Refresh** - Users can manually refresh rates anytime
- 📱 **Responsive Design** - Works on desktop and mobile devices
- ⚡ **Bidirectional Conversion** - Convert between two currencies instantly

## Tech Stack

- **Frontend Framework:** Vue 3 (Composition API with `<script setup>`)
- **Build Tool:** Vite
- **HTTP Client:** Axios
- **Exchange Rates API:** ExchangeRate-API (free tier)
- **Storage:** Browser localStorage for caching
- **Styling:** Vanilla CSS

## Project Setup

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Exchange Rate Data

### Real-time API Integration
The app uses [ExchangeRate-API](https://exchangerate-api.com) to fetch live exchange rates:
- **Free Tier:** 1,500 requests/month (sufficient for typical usage)
- **No API Key Required:** Free tier requires no authentication
- **Base Currency:** Currently configured for TWD (Taiwan Dollar)

### Caching Strategy
- **Cache Duration:** 1 hour (configurable in `.env`)
- **Storage:** Browser localStorage
- **Benefits:** Reduces API calls, faster load times, works offline
- **Manual Refresh:** Click "Refresh Rates" button to force new fetch

### Fallback Mechanism
If the API is unavailable, the app automatically falls back to static exchange rates from `public/exchange_rate.json`.

## Configuration

### Environment Variables
Copy `.env.example` to `.env.local` and customize:
```bash
# Exchange Rate API endpoint
VITE_EXCHANGE_RATE_API=https://api.exchangerate-api.com/v4/latest

# Cache expiry in hours
VITE_CACHE_EXPIRY_HOURS=1
```

### Supported APIs
You can switch to alternative exchange rate APIs:
- [ExchangeRate-API](https://exchangerate-api.com) - Free tier available
- [Open Exchange Rates](https://openexchangerates.org) - Free tier available
- [Fixer.io](https://fixer.io) - EUR-based, free tier available

## Troubleshooting

### "Failed to load exchange rates" Error
1. **Check Internet Connection:** Ensure you have internet access
2. **Check API Status:** Verify ExchangeRate-API is online
3. **Check Browser Console:** Look for detailed error messages (F12 → Console)
4. **Manual Fallback:** Refresh rates button will retry; if it fails, static rates are used

### Exchange Rates Not Updating
1. **Check Cache:** Wait 1 hour or manually click "Refresh Rates"
2. **Force Refresh:** Click the "Refresh Rates" button to fetch latest data
3. **Check localStorage:** Open DevTools (F12) → Application → localStorage

### Offline Mode
- The app works offline using cached/static rates
- All features remain functional except for refreshing from the API
- Cached rates are preserved for 1 hour

## Development Notes

### Adding New Currencies
1. Update the static fallback data in `public/exchange_rate.json`
2. The API automatically includes all supported currencies (190+)

### Changing Base Currency
Edit `src/App.vue` and update the `fetchExchangeRates()` call:
```javascript
await fetchExchangeRates('USD') // Change 'TWD' to desired currency
```

### Performance Optimization
- API calls are throttled to every 1 hour
- Results are cached in localStorage
- Failed requests don't block the UI
- Loading states provide user feedback

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License
See the main project repository for license information.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (previously Volar) and disable Vetur
