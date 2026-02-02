# Task 3: Testing & Fallback Verification

**Status:** ✅ Completed (Task 2)  
**Objective:** Test all scenarios and verify fallback mechanisms work correctly  
**Estimated Time:** 30 minutes  

## Test Scenarios

### Test 3.1: Cold Start (First Load)
- [x] Run `npm run dev`
- [x] Verify rates load from API
- [x] Check browser DevTools Network tab - see API call
- [x] Verify last update timestamp appears
- [x] No errors in console

### Test 3.2: Cache Behavior
- [x] Refresh the page
- [x] Verify rates load from cache (no new API call)
- [x] Timestamp should be same as before (if within 1 hour)

### Test 3.3: Manual Refresh
- [x] Click "Refresh Rates" button
- [x] Verify loading indicator shows
- [x] Verify new API call in Network tab
- [x] Verify timestamp updates
- [x] Verify rates update correctly

### Test 3.4: Offline/API Failure Simulation
- [x] Open DevTools Network tab → Offline mode
- [x] Click "Refresh Rates" button
- [x] Verify error message displays
- [x] Verify rates don't change (still show cached values)
- [x] Turn offline mode off, refresh should work again

### Test 3.5: Stale Cache
- [x] Open browser console
- [x] Manually set cache expiry to past time: 
  ```js
  localStorage.setItem('exchangeRateCacheTimestamp', Date.now() - 4000000)
  ```
- [x] Refresh page
- [x] Verify new API call is made (cache invalidated)

### Test 3.6: Static Fallback
- [x] Open DevTools → Network → Throttle to "Offline"
- [x] Hard refresh the page (Ctrl+Shift+R)
- [x] Verify rates still display from static JSON

## Verification Checklist
- [x] All test scenarios pass
- [x] No console errors logged
- [x] UI feedback for loading/errors is clear
- [x] Performance is acceptable (< 2 second API call)
- [x] Mobile view works correctly

## Files to Verify
- `src/services/exchangeRateService.js`
- `src/App.vue`
- `public/exchange_rate.json` (fallback)
