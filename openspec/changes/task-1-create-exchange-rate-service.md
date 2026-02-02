# Task 1: Create Exchange Rate Service

**Status:** ✅ Completed  
**Objective:** Build the core service module for fetching real-time exchange rates with caching and fallback  
**Estimated Time:** 30 minutes  

## Implementation Steps

### Step 1.1: Create `src/services/exchangeRateService.js`
Build a service module that:
- Fetches rates from ExchangeRate-API
- Implements localStorage caching with timestamp
- Falls back to fetch from static JSON on API failure
- Provides `fetchExchangeRates()` and `getCachedRates()` functions

### Step 1.2: API Configuration
- Store API endpoint as a constant
- Use environment variable for future API key (if needed)
- Implement reasonable timeout (5 seconds)

### Step 1.3: Error Handling
- Handle network errors gracefully
- Log errors for debugging
- Return cached data or null on failure

## Files to Create
- ✨ `src/services/exchangeRateService.js`

## Verification
- [x] Service module exports `fetchExchangeRates()` function
- [x] Returns array with currency objects: `{currency_name, currency, cash}`
- [x] Caches to localStorage with timestamp
- [x] Retrieves cached data within 1 hour
- [x] Falls back to static JSON on error
- [x] No console errors on cold start
