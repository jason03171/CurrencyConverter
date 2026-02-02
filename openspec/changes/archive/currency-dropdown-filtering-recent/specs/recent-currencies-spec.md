# Spec: Recent Currencies Data Structure

## Overview
Defines the shape of recent currency data stored in `localStorage` and managed by `currencyService.js`.

## Data Structure

### localStorage Key
```
"recentCurrencies"
```

### Value Format (JSON)
```json
{
  "version": 1,
  "data": [
    {
      "currency": "JPY",
      "lastUsed": 1707000000000,
      "count": 5
    },
    {
      "currency": "EUR",
      "lastUsed": 1706999000000,
      "count": 3
    },
    {
      "currency": "GBP",
      "lastUsed": 1706998000000,
      "count": 2
    }
  ]
}
```

### Fields
- **version** (number) — data format version for future migrations
- **data** (array of objects) — list of recent currencies
  - **currency** (string) — currency code (e.g., "JPY", "EUR")
  - **lastUsed** (number) — Unix timestamp (ms) of last selection
  - **count** (number) — total number of times this currency was selected

## Service Interface

### `addRecentCurrency(currencyCode)`
- Add or update `currencyCode` in recent list
- Set `lastUsed` to current timestamp
- Increment `count`
- If list exceeds 10 items, remove the entry with oldest `lastUsed`
- Return: updated `data` array

### `getRecentCurrencies(limit = 3)`
- Return top `limit` currencies sorted by `lastUsed` (most recent first)
- Return: array of currency code strings (e.g., `["JPY", "EUR", "GBP"]`)

### `clearRecentCurrencies()`
- Remove the `recentCurrencies` key from `localStorage`
- Return: `undefined`

## Migration Notes
- If no data exists in `localStorage`, initialize with empty array
- If version mismatch, reset to current version (no backwards-compat needed yet)
