# Proposal: Add currency dropdown filtering and recent-currency shortcuts

## Why

The currency dropdown can be cumbersome to navigate when browsing through many currencies. Users often repeatedly convert between the same few currencies. By adding:
1. **Input filtering** — users can quickly search for a specific currency by typing
2. **Recent currencies** — the top 3 most-used currencies appear at the top of the dropdown for quick access

This improves UX by reducing friction and making conversions faster.

## What Changes

### UI Enhancements
- **Search input** — add a text input field at the top of the dropdown that filters currencies in real-time by code (e.g., "USD"), name (e.g., "United States Dollar"), or abbreviation
- **Recent section** — display the top 3 most-used currencies in a separate section (e.g., "Recently Used") at the top of the dropdown, visually separated from the full list
- **Dropdown interaction** — maintain keyboard navigation (arrow keys, Enter) for accessibility

### Data Persistence
- **Track usage** — record which currency was selected and when
- **localStorage storage** — store recent currency selections and usage counts in `localStorage` under a key like `recentCurrencies`
- **Automatic cleanup** — if the list grows beyond a threshold, remove the least-recently-used entry

### Integration
- `src/App.vue` — update the dropdown template to include filter input and recent section
- `src/services/currencyService.js` (new) — manage recent currency data (add, get, clear)
- No API changes; purely client-side feature

## Impact

- **User-facing:** improved UX for common use cases (repeated conversions)
- **Code changes:** moderate — affects dropdown template, adds new service, adds localStorage logic
- **Performance:** negligible — filtering is client-side and recent data is lightweight
- **Testing:** need to verify filtering, recent-list updates, and persistence across page reloads

## Success Criteria

- [ ] Dropdown filter works in real-time
- [ ] Top 3 recent currencies display correctly
- [ ] Recent list updates after each conversion
- [ ] Data persists across page reloads
- [ ] Accessibility maintained (keyboard navigation)
- [ ] No console errors

