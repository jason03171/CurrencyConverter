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

// Historical data configuration
const HISTORY_API_ENDPOINT = 'https://api.frankfurter.app'
const HISTORY_CACHE_KEY_PREFIX = 'historicalRates_'
const HISTORY_CACHE_EXPIRY_HOURS = 24

/**
 * Generate cache key for historical data
 */
const getHistoryCacheKey = (baseCurrency, targetCurrency, days) => {
  return `${HISTORY_CACHE_KEY_PREFIX}${baseCurrency}_${targetCurrency}_${days}`
}

/**
 * Check if historical data cache is valid
 */
const isHistoryCacheValid = (cacheKey) => {
  const timestampKey = `${cacheKey}_timestamp`
  const timestamp = localStorage.getItem(timestampKey)
  if (!timestamp) return false

  const age = (Date.now() - parseInt(timestamp)) / (1000 * 60 * 60) // Convert to hours
  return age < HISTORY_CACHE_EXPIRY_HOURS
}

/**
 * Get cached historical data
 */
const getCachedHistoricalData = (cacheKey) => {
  try {
    const cached = localStorage.getItem(cacheKey)
    return cached ? JSON.parse(cached) : null
  } catch (error) {
    console.warn('Error reading historical data from cache:', error)
    return null
  }
}

/**
 * Save historical data to cache
 */
const setCachedHistoricalData = (cacheKey, data) => {
  try {
    localStorage.setItem(cacheKey, JSON.stringify(data))
    localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString())
  } catch (error) {
    console.warn('Error writing historical data to cache:', error)
  }
}

/**
 * Transform historical API response to chart data format
 * Frankfurter API response: { rates: { "2024-01-01": { "EUR": 0.85 }, ... } }
 * Chart format: [{ date: "2024-01-01", rate: 0.85 }, ...]
 */
const transformHistoricalResponse = (apiData, targetCurrency) => {
  const rates = apiData.rates || {}

  return Object.entries(rates)
    .map(([date, dailyRates]) => ({
      date,
      rate: parseFloat(dailyRates[targetCurrency])
    }))
    .filter(item => !isNaN(item.rate))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
}

/**
 * Generate mock historical data for demonstration
 * Creates realistic-looking historical data based on current rates
 */
const generateMockHistoricalData = async (baseCurrency, targetCurrency, days) => {
  const data = []

  // Try to get current rate by calculating through TWD as bridge
  let currentRate = 1.0 // fallback

  try {
    // Get TWD-based rates
    const twdRates = await fetchExchangeRates('TWD', false)

    const baseRateData = twdRates.find(r => r.currency === baseCurrency)
    const targetRateData = twdRates.find(r => r.currency === targetCurrency)

    if (baseRateData && targetRateData && baseRateData.cash && targetRateData.cash) {
      // Calculate cross rate: 1 baseCurrency = (baseRate / targetRate) targetCurrency
      // Since both rates are quoted against TWD, we divide base rate by target rate
      currentRate = baseRateData.cash / targetRateData.cash
    } else if (baseCurrency === 'TWD' && targetRateData) {
      // Direct TWD to target
      currentRate = targetRateData.cash
    } else if (targetCurrency === 'TWD' && baseRateData) {
      // Direct base to TWD (inverse)
      currentRate = 1 / baseRateData.cash
    } else {
      // Use fallback rates for common pairs
      const fallbackRates = {
        'USD/EUR': 0.85,
        'EUR/USD': 1.18,
        'USD/JPY': 110,
        'JPY/USD': 0.0091,
        'USD/GBP': 0.73,
        'GBP/USD': 1.37,
        'USD/CAD': 1.25,
        'CAD/USD': 0.80,
        'USD/AUD': 1.35,
        'AUD/USD': 0.74
      }

      const pairKey = `${baseCurrency}/${targetCurrency}`
      currentRate = fallbackRates[pairKey] || 1.0
    }
  } catch (error) {
    console.warn('Could not get current rate for mock data, using fallback:', error.message)

    // Use fallback rates for common pairs
    const fallbackRates = {
      'USD/EUR': 0.85,
      'EUR/USD': 1.18,
      'USD/JPY': 110,
      'JPY/USD': 0.0091,
      'USD/GBP': 0.73,
      'GBP/USD': 1.37,
      'USD/CAD': 1.25,
      'CAD/USD': 0.80,
      'USD/AUD': 1.35,
      'AUD/USD': 0.74,
      'TWD/USD': 0.032,
      'USD/TWD': 31.25
    }

    const pairKey = `${baseCurrency}/${targetCurrency}`
    currentRate = fallbackRates[pairKey] || 1.0
  }

  // Generate data for the past N days
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    // Add realistic daily variation (±1-3% depending on currency pair)
    // Some currency pairs are more volatile than others
    const volatility = (baseCurrency === 'TWD' && targetCurrency === 'USD') ? 0.015 :
                      (baseCurrency === 'USD' && targetCurrency === 'EUR') ? 0.008 :
                      (baseCurrency === 'USD' && targetCurrency === 'JPY') ? 0.012 :
                      (baseCurrency === 'EUR' && targetCurrency === 'GBP') ? 0.010 : 0.012

    // Add some trend (slight upward or downward movement over time)
    const trend = (i / days) * 0.002 // Small trend over the period

    const randomVariation = (Math.random() - 0.5) * volatility * 2
    const rate = currentRate * (1 + randomVariation + trend)

    data.push({
      date: date.toISOString().split('T')[0],
      rate: parseFloat(rate.toFixed(6))
    })
  }

  return data
}

/**
 * Fetch historical exchange rates from API
 */
const fetchHistoricalFromApi = async (baseCurrency, targetCurrency, days) => {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - days)

  const startDateStr = startDate.toISOString().split('T')[0]
  const endDateStr = endDate.toISOString().split('T')[0]

  try {
    // Try Frankfurter API first (only works for EUR-based currencies)
    if (baseCurrency === 'EUR' || targetCurrency === 'EUR') {
      const response = await axios.get(
        `${HISTORY_API_ENDPOINT}/${startDateStr}..${endDateStr}?from=${baseCurrency}&to=${targetCurrency}`,
        { timeout: API_TIMEOUT_MS }
      )

      if (response.data && response.data.rates) {
        const transformed = transformHistoricalResponse(response.data, targetCurrency)
        const cacheKey = getHistoryCacheKey(baseCurrency, targetCurrency, days)
        setCachedHistoricalData(cacheKey, transformed)
        return transformed
      }
    }

    // For other currencies, use mock data
    console.log(`Frankfurter API doesn't support ${baseCurrency}/${targetCurrency}, using mock data`)
    const mockData = await generateMockHistoricalData(baseCurrency, targetCurrency, days)
    const cacheKey = getHistoryCacheKey(baseCurrency, targetCurrency, days)
    setCachedHistoricalData(cacheKey, mockData)
    return mockData

  } catch (error) {
    console.error('Error fetching historical data from API:', error.message)

    // Fallback to mock data
    console.log('Falling back to mock historical data')
    const mockData = await generateMockHistoricalData(baseCurrency, targetCurrency, days)
    const cacheKey = getHistoryCacheKey(baseCurrency, targetCurrency, days)
    setCachedHistoricalData(cacheKey, mockData)
    return mockData
  }
}

/**
 * Main function to fetch historical exchange rates
 * Priority: Cache → API
 */
export const fetchHistoricalRates = async (baseCurrency = 'TWD', targetCurrency = 'USD', days = 30) => {
  const cacheKey = getHistoryCacheKey(baseCurrency, targetCurrency, days)

  try {
    // Try cache first
    if (isHistoryCacheValid(cacheKey)) {
      const cached = getCachedHistoricalData(cacheKey)
      if (cached) {
        console.log('Using cached historical rates')
        return cached
      }
    }

    // Fetch from API
    console.log('Fetching historical rates from API')
    return await fetchHistoricalFromApi(baseCurrency, targetCurrency, days)

  } catch (error) {
    console.error('Error in fetchHistoricalRates:', error)
    throw error
  }
}

/**
 * Get the timestamp of when historical rates were last updated
 */
export const getHistoricalLastUpdateTime = (baseCurrency, targetCurrency, days) => {
  const cacheKey = getHistoryCacheKey(baseCurrency, targetCurrency, days)
  const timestampKey = `${cacheKey}_timestamp`
  const timestamp = localStorage.getItem(timestampKey)
  return timestamp ? new Date(parseInt(timestamp)) : null
}

/**
 * Clear historical data cache
 */
export const clearHistoricalCache = () => {
  const keys = Object.keys(localStorage).filter(key => key.startsWith(HISTORY_CACHE_KEY_PREFIX))
  keys.forEach(key => localStorage.removeItem(key))
}

export default {
  fetchExchangeRates,
  getLastUpdateTime,
  getCachedRates,
  clearCache,
  fetchHistoricalRates,
  getHistoricalLastUpdateTime,
  clearHistoricalCache
}
