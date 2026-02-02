# Consolidated Tasks: Add Real-time Exchange Rate Fetching

## Task 1: Create Exchange Rate Service

**Status:** ✅ Completed

**Objective:** Build the core service module for fetching real-time exchange rates with caching and fallback

### Implementation Steps
- Create `src/services/exchangeRateService.js` to:
  - Fetch rates from ExchangeRate-API
  - Implement localStorage caching with timestamp
  - Fallback to static JSON on API failure
  - Export `fetchExchangeRates()` and helpers
- API configuration: constant endpoint, optional API key via env
- Error handling: network errors gracefully handled

### Verification
- [x] `fetchExchangeRates()` exported
- [x] Returns array of `{currency_name,currency,cash}`
- [x] Caches with timestamp
- [x] Falls back to static JSON on error

---

## Task 2: Update App.vue

**Status:** ✅ Completed

**Objective:** Integrate exchange rate service into `src/App.vue` with UI states

### Implementation Steps
- Import `fetchExchangeRates` and call on mount
- Add refs: `isLoading`, `error`, `lastUpdated`
- Replace static JSON call with service
- Add "Refresh Rates" button and last-updated timestamp
- Fix typo `setDefalut` → `setDefault`

### Verification
- [x] Rates load on mount
- [x] Loading and error states work
- [x] Manual refresh updates rates

---

## Task 3: Testing & Fallback Verification

**Status:** ✅ Completed

**Test Scenarios**
- Cold start: rates load from API
- Cache behavior: subsequent loads use cache
- Manual refresh: forces API call and updates timestamp
- Offline/API failure: fallback to cache or static JSON
- Stale cache: invalidation triggers API fetch

### Verification Checklist
- [x] All scenarios pass
- [x] No console errors

---

## Task 4: Documentation & Configuration

**Status:** ✅ Completed

**Implementation Steps**
- Add `.env.example` with `VITE_EXCHANGE_RATE_API` and `VITE_CACHE_EXPIRY_HOURS`
- Update `README.md` with integration details and troubleshooting
- Update `openspec/project.md` to reflect new feature

### Verification
- [x] `.env.example` created
- [x] README updated
- [x] Project docs updated

---

**Notes:** Original individual task files have been consolidated into this single checklist. Archive or remove originals as needed.
