import axios from 'axios'

// Configuration
const API_ENDPOINT = 'https://api.exchangerate-api.com/v4/latest'
const CACHE_KEY = 'exchangeRates'
const CACHE_TIMESTAMP_KEY = 'exchangeRateCacheTimestamp'
const CACHE_EXPIRY_HOURS = 1
const API_TIMEOUT_MS = 5000

/**
 * Transform API response to match our internal format
 * API response: { rates: { USD: 1, EUR: 0.92, ... } }
 * Internal format: { currency_name: 'name', currency: 'CODE', cash: rate }
 */
const transformApiResponse = (apiData, baseCurrency = 'TWD') => {
  const rates = apiData.rates || {}

  // Normalize to: cash = TWD per 1 unit of currency
  // Static JSON uses cash as TWD per currency (e.g., 1 JPY = 0.2109 TWD)
  // Many APIs return rates as "target currency per 1 base" (e.g., 1 TWD = 4.9 JPY).
  // When API base is TWD (or baseCurrency === 'TWD'), we invert the rate to get TWD per unit.
  const list = Object.entries(rates).map(([code, rate]) => {
    const numericRate = parseFloat(rate)
    let cash
    if (baseCurrency === 'TWD') {
      // API gives: 1 TWD = numericRate * CODE
      // We want: 1 CODE = (1 / numericRate) TWD
      cash = numericRate > 0 ? parseFloat((1 / numericRate).toFixed(6)) : null
    } else {
      // If API base is not TWD, attempt to compute TWD per unit by using apiData.rates['TWD'] if present
      const rateToTWD = parseFloat(rates['TWD'])
      if (rateToTWD && numericRate) {
        // numericRate = units of CODE per 1 base
        // rateToTWD = units of TWD per 1 base
        // So 1 CODE = (rateToTWD / numericRate) TWD
        cash = parseFloat((rateToTWD / numericRate).toFixed(6))
      } else {
        cash = null
      }
    }

    return {
      currency_name: code,
      currency: code,
      cash
    }
  })

  return list
}

/**
 * Check if cached data is still valid
 */
const isCacheValid = () => {
  const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY)
  if (!timestamp) return false
  
  const age = (Date.now() - parseInt(timestamp)) / (1000 * 60 * 60) // Convert to hours
  return age < CACHE_EXPIRY_HOURS
}

/**
 * Get cached exchange rates
 */
const getCachedRates = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    return cached ? JSON.parse(cached) : null
  } catch (error) {
    console.warn('Error reading from cache:', error)
    return null
  }
}

/**
 * Save rates to cache
 */
const setCachedRates = (rates) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(rates))
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString())
  } catch (error) {
    console.warn('Error writing to cache:', error)
  }
}

/**
 * Fetch exchange rates from API
 */
const fetchFromApi = async (baseCurrency = 'TWD') => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/${baseCurrency}`, {
      timeout: API_TIMEOUT_MS
    })
    
    if (response.data && response.data.rates) {
      const transformed = transformApiResponse(response.data, baseCurrency)
      setCachedRates(transformed)
      return transformed
    }
    
    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching from API:', error.message)
    throw error
  }
}

/**
 * Fetch static exchange rates from JSON file
 */
const fetchStaticRates = async () => {
  try {
    const response = await axios.get('/CurrencyConverter/exchange_rate.json')
    const list = response.data.map(item => {
      const code = (item.currency.split(' ')[1] || '').replace(/\(|\)/g, '')
      return {
        currency_name: code,
        currency: code,
        cash: parseFloat(item.cash_ask)
      }
    })
    return list
  } catch (error) {
    console.error('Error fetching static rates:', error.message)
    throw error
  }
}

/**
 * Main function to fetch exchange rates
 * Priority: API → Cache → Static JSON
 */
export const fetchExchangeRates = async (baseCurrency = 'TWD', forceRefresh = false) => {
  try {
    // Try API first (unless user has cached and valid data)
    if (forceRefresh || !isCacheValid()) {
      try {
        return await fetchFromApi(baseCurrency)
      } catch (apiError) {
        console.log('API fetch failed, checking cache...')
        
        // Fall back to cache if available
        const cached = getCachedRates()
        if (cached) {
          console.log('Using cached exchange rates')
          return cached
        }
        
        // Fall back to static JSON
        console.log('Cache unavailable, using static rates')
        return await fetchStaticRates()
      }
    }
    
    // Use cached data if valid
    const cached = getCachedRates()
    if (cached) {
      console.log('Using cached exchange rates (still valid)')
      return cached
    }
    
    // No cache, try API
    try {
      return await fetchFromApi(baseCurrency)
    } catch (apiError) {
      console.log('API failed, falling back to static rates')
      return await fetchStaticRates()
    }
  } catch (error) {
    console.error('Fatal error in fetchExchangeRates:', error)
    throw error
  }
}

/**
 * Get the timestamp of when rates were last updated
 */
export const getLastUpdateTime = () => {
  const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY)
  return timestamp ? new Date(parseInt(timestamp)) : null
}

/**
 * Clear cache (useful for testing)
 */
export const clearCache = () => {
  localStorage.removeItem(CACHE_KEY)
  localStorage.removeItem(CACHE_TIMESTAMP_KEY)
}

export default {
  fetchExchangeRates,
  getLastUpdateTime,
  getCachedRates,
  clearCache
}
