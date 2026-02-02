# Proposal: Add Real-time Exchange Rate Fetching

**Status:** ✅ ARCHIVED (Completed February 2, 2026)

## Problem Statement
Currently, the Currency Converter app uses static exchange rates from `public/exchange_rate.json`. This means:
- Exchange rates become stale and inaccurate over time
- Users cannot rely on the app for current market rates
- Manual updates to the JSON file are required
- No refresh capability for users

## Proposed Solution
Integrate a real-time exchange rate API to fetch current rates when the app loads and provide an optional refresh button for users to get the latest rates.

### Recommended API
Use a free exchange rate API such as:
- **ExchangeRate-API** (https://exchangerate-api.com) - Free tier: 1,500 requests/month
- **Open Exchange Rates** (https://openexchangerates.org) - Free tier: 1,000 requests/month
- **Fixer.io** (https://fixer.io) - EUR-based, free tier available

**Decision:** Start with ExchangeRate-API for simplicity (no API key required for basic usage, or free key available)

## Implementation Details

### Phase 1: API Integration
1. **Create API service module** (`src/services/exchangeRateService.js`)
   - Fetch rates from API with fallback to static JSON
   - Handle network errors gracefully
   - Cache results with timestamp for offline support

2. **Update App.vue**
   - Replace static `getExchangeRate()` with API call
   - Add loading and error states
   - Add "Refresh Rates" button with feedback

3. **Configuration**
   - Store API endpoint in environment variables (`.env.local`)
   - Make API choice configurable via `openspec/config.yaml`

### Phase 2: Error Handling & UX
- Show loading indicator during fetch
- Display error message with fallback option
- Show last update timestamp
- Auto-fallback to cached/static rates if API fails

### Data Flow
```
App mounts
  → Check cached rates (localStorage)
  → If stale/missing → Fetch from API
  → If API fails → Use static JSON fallback
  → Display rates & timestamp
  → User can click "Refresh" button anytime
```

## Tasks for Implementation

### Task 1: Create Exchange Rate Service
- [x] Create `src/services/exchangeRateService.js`
- [x] Implement API fetch with error handling
- [x] Add localStorage caching with 1-hour expiry
- [x] Export `fetchExchangeRates()` function

### Task 2: Update App.vue
- [x] Import exchange rate service
- [x] Update `getExchangeRate()` to use new service
- [x] Add loading state (`isLoading` ref)
- [x] Add error state (`error` ref)
- [x] Add last update timestamp display
- [x] Create "Refresh Rates" button UI

### Task 3: Testing & Fallback
- [x] Test API fetch on cold start
- [x] Test caching behavior
- [x] Test error scenarios (offline, API down)
- [x] Verify static JSON fallback works
- [x] Test manual refresh

### Task 4: Documentation
- [x] Update `README.md` with setup instructions
- [x] Document API integration in `openspec/project.md`
- [x] Add `.env.example` file

## Success Criteria
- ✅ Rates update on app load from API
- ✅ Rates display current market values (within 5 minutes)
- ✅ Graceful fallback to static JSON if API unavailable
- ✅ Manual refresh button works correctly
- ✅ Last update timestamp shown to user
- ✅ No console errors for network failures
- ✅ Loading indicator displays during fetch

## Non-goals
- Multi-currency pair support beyond what exists
- Historical rate tracking
- Rate change alerts/notifications
- Premium API features (this proposal uses free tier)
- Currency conversion logic changes (only data source changes)
- Database persistence (localStorage only)

## Risks & Mitigation
| Risk | Mitigation |
|------|-----------|
| API rate limits | Implement caching; use free tier with generous limits |
| Network latency | Show loading state; don't block UI on fetch |
| API downtime | Fallback to static JSON and cached rates |
| API key exposure | Use client-side free tier or proxy; never commit keys |

## Timeline Estimate
- Task 1 (Service): 30 minutes
- Task 2 (UI Update): 45 minutes
- Task 3 (Testing): 30 minutes
- Task 4 (Documentation): 15 minutes
- **Total: ~2 hours**

## Files Modified/Created
- ✨ `src/services/exchangeRateService.js` (created)
- ✨ `.env.example` (created)
- ✏️ `src/App.vue` (modified)
- ✏️ `README.md` (modified)
- ✏️ `openspec/project.md` (modified)

## Implementation Summary
All 4 tasks completed successfully. Real-time exchange rates integrated with:
- API caching and fallback to static JSON
- Loading and error states
- Manual refresh capability
- Last update timestamp display
- Fixed currency conversion formula (rates normalized to TWD per unit)
- Duplicate currency removal and sensible defaults (TWD/USD on load)

---

**Archived:** February 2, 2026  
**Completed by:** GitHub Copilot
