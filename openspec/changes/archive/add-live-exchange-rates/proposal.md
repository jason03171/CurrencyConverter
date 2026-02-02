# Proposal: Add Real-time Exchange Rate Fetching

## Why

Currently the app relies on static `public/exchange_rate.json`. That leads to stale rates, manual updates, and no user-triggered refresh. Real-time rates improve accuracy and user trust.

## What Changes

- Add `src/services/exchangeRateService.js` to fetch live rates with caching and fallback.
- Replace static JSON fetch in `src/App.vue` with calls to the service.
- Add UI elements: loading state, error state, "Refresh Rates" button, and last-updated timestamp.
- Add `.env.example` to configure API endpoint and cache expiry.
- Update `README.md` and `openspec/project.md` to document the integration.

## Impact

- Affects: `src/App.vue`, new `src/services/exchangeRateService.js`, `public/exchange_rate.json` (fallback), docs.
- Risks: API rate limits, occasional downtime — mitigated by caching and static fallback.
- Rollback: revert `App.vue` to static JSON fetch; clear localStorage cache.
- Tests: cold start, cache behavior, offline fallback, manual refresh.
