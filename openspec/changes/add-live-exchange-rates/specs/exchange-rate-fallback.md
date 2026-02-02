# Exchange Rate Fallback Spec

## Description
Describe the expected behavior when live API is unavailable.

## Before
- App used only `public/exchange_rate.json` (static rates).

## After
- App attempts API fetch first.
- If API succeeds → use live rates and cache them.
- If API fails and valid cache exists → use cached rates.
- If API fails and no cache → use `public/exchange_rate.json` as fallback.

## Verification
- Simulate offline API and verify fallback order.
- Confirm last-updated timestamp reflects cache time.
