# Task 2: Update App.vue

**Status:** ✅ Completed (Task 1)  
**Objective:** Integrate the new exchange rate service into App.vue with loading and error states  
**Estimated Time:** 45 minutes  

## Implementation Steps

### Step 2.1: Import Service
- Import `fetchExchangeRates` from the new service

### Step 2.2: Add State Refs
- `isLoading` - tracks fetch in progress
- `error` - stores error message
- `lastUpdated` - timestamp of last successful fetch

### Step 2.3: Update `getExchangeRate()`
- Replace axios call with service call
- Set `isLoading = true` before fetch
- Set `isLoading = false` after fetch
- Handle errors and set `error` message
- Update `lastUpdated` timestamp

### Step 2.4: Add Refresh Button UI
- Add button text "Refresh Rates"
- Show loading state during refresh
- Display last update timestamp below rates
- Show error message if fetch fails

### Step 2.5: Fix Typo
- Rename `setDefalut` to `setDefault` (while we're here)

## Files to Modify
- ✏️ `src/App.vue`

## Verification
- [x] App loads rates on mount (from API or cache)
- [x] Loading indicator shows during fetch
- [x] Error message displays if API fails
- [x] Fallback to static rates works
- [x] Refresh button fetches new rates
- [x] Last updated timestamp displays correctly
- [x] No console errors
