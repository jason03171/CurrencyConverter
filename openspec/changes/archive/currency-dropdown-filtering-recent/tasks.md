# Tasks: Currency Dropdown Filtering & Recent Currencies

## Task 1: Create Currency Service

**Status:** ✅ Completed  
**Objective:** Build a service module to manage recent currency tracking and retrieval  
**Estimated Time:** 30 minutes

### Implementation Steps
- Create `src/services/currencyService.js` with functions:
  - `addRecentCurrency(currencyCode)` — add or update a currency in recent list
  - `getRecentCurrencies(limit)` — retrieve top N recent currencies (default 3)
  - `clearRecentCurrencies()` — reset recent list
- Use `localStorage` key `recentCurrencies` to persist data as JSON
- Store metadata: `{currency, lastUsed: timestamp, count: usageCount}`
- Implement automatic cleanup: if list exceeds 10 items, remove oldest

### Files to Create/Modify
- ✏️ `src/services/currencyService.js` (new)

### Verification
- [x] Service exports all three functions
- [x] localStorage correctly stores and retrieves data
- [x] Cleanup logic works (max 10 items)
- [x] No console errors

---

## Task 2: Update App.vue – Dropdown Template

**Status:** ✅ Completed  
**Objective:** Add filter input and recent-currencies section to the dropdown UI  
**Estimated Time:** 45 minutes

### Implementation Steps
- Import `currencyService`
- Add refs: `filterQuery`, `recentCurrencies`, `filteredRateList`
- Add computed property or watcher to filter `rateList` based on `filterQuery` (search by currency code, name)
- Load recent currencies on mount
- Update dropdown template:
  - Add search input field at top
  - Add "Recently Used" section showing top 3 currencies (if available)
  - Show filtered list below
- Call `currencyService.addRecentCurrency()` when a currency is selected

### Files to Modify
- ✏️ `src/App.vue`

### Verification
- [x] Filter input appears at top of dropdown
- [x] Typing filters currencies in real-time
- [x] Recent section displays top 3 currencies
- [x] Selecting a currency updates recent list
- [x] No console errors

---

## Task 3: Testing & Persistence

**Status:** ✅ Completed  
**Objective:** Verify filtering, recent-list updates, and localStorage persistence  
**Estimated Time:** 30 minutes

### Test Scenarios
1. **Filter functionality:**
   - Type "USD" → only USD appears
   - Type "Dollar" → USD, Australian Dollar, etc. appear
   - Clear filter → full list returns
2. **Recent list:**
   - Select JPY, EUR, GBP in sequence
   - Recent section shows JPY, EUR, GBP (most to least recent)
   - Refresh page → recent list persists
3. **Cleanup:**
   - Add 11+ different currencies in sequence
   - Verify oldest is removed (list stays ≤ 10)

### Verification Checklist
- [x] All filter scenarios pass
- [x] Recent list updates correctly
- [x] localStorage persists data across reloads
- [x] No console errors

---

## Task 4: Accessibility & Polish

**Status:** ✅ Completed  
**Objective:** Ensure keyboard navigation and UX polish  
**Estimated Time:** 30 minutes

### Implementation Steps
- Add ARIA labels to filter input
- Test keyboard navigation: arrow keys, Enter, Escape to close dropdown
- Ensure recent and filtered sections are properly announced by screen readers
- Add visual styling: separator between recent and full list, hover states
- Document the feature in `README.md`

### Files to Modify
- ✏️ `src/App.vue` (ARIA attributes)
- ✏️ `src/style.css` (styling if needed)
- ✏️ `README.md` (feature documentation)

### Verification
- [x] Keyboard navigation works
- [x] Screen reader announces sections correctly
- [x] Visual separator between sections (optgroup labels)
- [x] Styling is consistent with app theme
- [x] README documents the feature

---

**Notes:** All tasks completed. Feature is production-ready.
