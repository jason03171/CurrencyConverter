/**
 * Currency Service
 * Manages recent currency tracking and retrieval for quick access
 */

const STORAGE_KEY = 'recentCurrencies'
const MAX_RECENT = 10
const DEFAULT_RECENT_LIMIT = 3

/**
 * Initialize storage if not exists
 */
function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: 1,
      data: []
    }))
  }
}

/**
 * Get stored recent currencies data
 */
function getStoredData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) {
      initializeStorage()
      return { version: 1, data: [] }
    }
    return JSON.parse(data)
  } catch (err) {
    console.error('Error reading recent currencies from storage:', err)
    return { version: 1, data: [] }
  }
}

/**
 * Save data to storage
 */
function saveData(storedData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedData))
  } catch (err) {
    console.error('Error saving recent currencies to storage:', err)
  }
}

/**
 * Add or update a currency in the recent list
 * @param {string} currencyCode - Currency code (e.g., 'USD', 'JPY')
 */
export function addRecentCurrency(currencyCode) {
  if (!currencyCode) return

  const stored = getStoredData()
  const data = stored.data || []

  // Find existing entry
  const existingIndex = data.findIndex(entry => entry.currency === currencyCode)

  if (existingIndex >= 0) {
    // Update existing entry
    data[existingIndex].lastUsed = Date.now()
    data[existingIndex].count = (data[existingIndex].count || 0) + 1
    // Move to front by removing and re-adding
    const updated = data.splice(existingIndex, 1)[0]
    data.unshift(updated)
  } else {
    // Add new entry
    data.unshift({
      currency: currencyCode,
      lastUsed: Date.now(),
      count: 1
    })
  }

  // Enforce max size (keep only most recent)
  if (data.length > MAX_RECENT) {
    data.pop()
  }

  stored.data = data
  saveData(stored)

  console.log('Recent currency updated:', currencyCode)
}

/**
 * Get top N recent currencies
 * @param {number} limit - Number of currencies to return (default: 3)
 * @returns {string[]} Array of currency codes
 */
export function getRecentCurrencies(limit = DEFAULT_RECENT_LIMIT) {
  const stored = getStoredData()
  const data = stored.data || []
  return data.slice(0, limit).map(entry => entry.currency)
}

/**
 * Clear all recent currencies
 */
export function clearRecentCurrencies() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    version: 1,
    data: []
  }))
  console.log('Recent currencies cleared')
}

/**
 * Get all recent currencies with metadata
 * @returns {object[]} Full list of recent currencies
 */
export function getAllRecentCurrencies() {
  const stored = getStoredData()
  return stored.data || []
}
