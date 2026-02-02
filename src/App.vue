<script setup>
import { onMounted, ref, reactive, computed } from 'vue'
import { fetchExchangeRates, getLastUpdateTime } from './services/exchangeRateService'
import { addRecentCurrency, getRecentCurrencies } from './services/currencyService'

onMounted(async () => {
  await getExchangeRate()
  // Load recent currencies
  recentCurrencies.value = getRecentCurrencies(3)
  setDefault('USD')
  // Restore theme from localStorage
  const saved = localStorage.getItem('theme')
  if (saved) document.documentElement.setAttribute('data-theme', saved)
})

const theme = ref(document.documentElement.getAttribute('data-theme') || 'dark')

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme.value)
  localStorage.setItem('theme', theme.value)
}

const rateLists = ref([])

// Filter and recent currencies
const filterQuery = ref('')
const recentCurrencies = ref([])

// Loading and error states
const isLoading = ref(false)
const error = ref(null)
const lastUpdated = ref(null)

// Computed property to filter currencies
const filteredRateList = computed(() => {
  if (!filterQuery.value.trim()) {
    return rateLists.value
  }
  const query = filterQuery.value.toLowerCase()
  return rateLists.value.filter(item => {
    return (
      item.currency.toLowerCase().includes(query) ||
      (item.currency_name && item.currency_name.toLowerCase().includes(query))
    )
  })
})

// 取得匯率 (from API with caching and fallback)
const getExchangeRate = async (forceRefresh = false) => {
  isLoading.value = true
  error.value = null
  
  try {
    const newRates = await fetchExchangeRates('TWD', forceRefresh)
    // Deduplicate by currency code (keep first occurrence)
    const seen = new Set()
    const unique = []
    for (const r of newRates) {
      if (!r || !r.currency) continue
      if (seen.has(r.currency)) continue
      seen.add(r.currency)
      unique.push(r)
    }
    rateLists.value = unique

    // Update last update timestamp
    lastUpdated.value = getLastUpdateTime()

    console.log('Exchange rates updated successfully')
    // Set sensible defaults if not already set
    const hasTWD = rateLists.value.find(r => r.currency === 'TWD')
    const hasUSD = rateLists.value.find(r => r.currency === 'USD')
    if (!front.currency && hasTWD) {
      setCurrency('front', 'TWD')
    }
    if (!back.currency && hasUSD) {
      setCurrency('back', 'USD')
    }
  } catch (err) {
    error.value = `Failed to load exchange rates: ${err.message}`
    console.error('Error fetching exchange rates:', err)
  } finally {
    isLoading.value = false
  }
}

const front = reactive({
  currency: '',
  rate: 0,
  input: 1
})

const back = reactive({
  currency: '',
  rate: 0,
  input: 0
})

// 設定預設匯率
const setDefault = (defaultCurrency) => {
  setCurrency('back', defaultCurrency)
}

const targets = { // targets 集合
  front,
  back
}
// 設定匯率
const setCurrency = (target, currency) => {
  const tempRate = rateLists.value.find(item => item.currency === currency)
  if (!tempRate) {
    console.warn(`setCurrency: currency ${currency} not found`)
    return
  }
  console.log(`setCurrency -> target=${target} currency=${currency} rate=${tempRate?.cash}`)
  targets[target].currency = tempRate.currency
  targets[target].rate = tempRate.cash
  
  // Track recent currency
  addRecentCurrency(currency)
  recentCurrencies.value = getRecentCurrencies(3)
  
  calcExchangeRate(target)
}

// 變更匯率
const changeCurrency = (target) => {
  setCurrency(target, targets[target].currency)
}

// Calculate exchange rate between targets
const calcExchangeRate = (target) => {
  const otherTarget = target === 'front' ? 'back' : 'front'
  // Rates are stored as "units of currency per TWD" (e.g. JPY = 4.9 means 1 TWD = 4.9 JPY)
  // To convert: target_input = source_input * (source.rate / target.rate)
  const sourceInput = parseFloat(targets[otherTarget].input) || 0
  const sourceRate = parseFloat(targets[otherTarget].rate) || 0
  const targetRate = parseFloat(targets[target].rate) || 0
  const inTWD = sourceInput * sourceRate
  const result = targetRate > 0 ? inTWD / targetRate : 0
  console.log(`calcExchangeRate: source=${targets[otherTarget].currency} input=${sourceInput} sourceRate=${sourceRate} target=${targets[target].currency} targetRate=${targetRate} inTWD=${inTWD} result=${result}`)
  targets[target].input = parseFloat(result.toFixed(4))
}


</script>

<template>
  <div id="container">
    <header class="app-header">
      <div class="header-left"></div>
      <div class="header-right">
        <button class="theme-toggle" @click="toggleTheme" :aria-pressed="theme === 'light'">
          {{ theme === 'light' ? '🌞' : '🌙' }}
        </button>
      </div>
    </header>
    <div class="card">
    <!-- Error message display -->
    <div v-if="error" class="error-message">
      ⚠️ {{ error }}
    </div>
    
    <!-- Loading indicator -->
    <div v-if="isLoading" class="loading-indicator">
      Loading rates...
    </div>
    
    <!-- Last updated timestamp -->
    <div v-if="lastUpdated && !isLoading" class="last-updated">
      Last updated: {{ lastUpdated.toLocaleTimeString() }}
    </div>
    
    <!-- Refresh button -->
    <button 
      @click="getExchangeRate(true)" 
      :disabled="isLoading"
      class="refresh-button"
    >
      {{ isLoading ? 'Refreshing...' : 'Refresh Rates' }}
    </button>

    <div class="showcurrency">
      <p>
        1 {{front.currency}} = {{ (back.rate && front.rate) ? parseFloat((front.rate / back.rate).toFixed(4)) : '—' }} {{back.currency}}
      </p>
    </div>
    <div class="currencyconverter">
      <input
        type="text"
        v-model="front.input"
        @input="calcExchangeRate('back');"
      />
      <div class="select-wrapper">
        <input 
          type="text" 
          v-model="filterQuery"
          placeholder="Filter currencies..."
          class="filter-input"
          aria-label="Filter currencies"
        />
        <select v-model="front.currency" @change="changeCurrency('front')" aria-label="Select front currency">
          <!-- Recently Used Section -->
          <optgroup v-if="recentCurrencies.length > 0" label="Recently Used">
            <option
              v-for="recentCode in recentCurrencies"
              :key="`recent-front-${recentCode}`"
              :value="recentCode"
              :label="rateLists.find(r => r.currency === recentCode)?.currency_name || recentCode"
            >
              {{ rateLists.find(r => r.currency === recentCode)?.currency_name || recentCode }}
            </option>
          </optgroup>
          
          <!-- All Currencies (filtered) -->
          <optgroup label="All Currencies">
            <option
              v-for="item in filteredRateList"
              :key="`front${item.currency}`"
              :value="item.currency"
              :label="item.currency_name"
            >
              {{ item.currency_name }}
            </option>
          </optgroup>
        </select>
      </div>
    </div>
    <div class="currencyconverter">
      <input
        type="text"
        v-model="back.input"
        @input="calcExchangeRate('front');"
      />
      <div class="select-wrapper">
        <input 
          type="text" 
          v-model="filterQuery"
          placeholder="Filter currencies..."
          class="filter-input"
          aria-label="Filter currencies"
        />
        <select v-model="back.currency" @change="changeCurrency('back')" aria-label="Select back currency">
          <!-- Recently Used Section -->
          <optgroup v-if="recentCurrencies.length > 0" label="Recently Used">
            <option
              v-for="recentCode in recentCurrencies"
              :key="`recent-back-${recentCode}`"
              :value="recentCode"
              :label="rateLists.find(r => r.currency === recentCode)?.currency_name || recentCode"
            >
              {{ rateLists.find(r => r.currency === recentCode)?.currency_name || recentCode }}
            </option>
          </optgroup>
          
          <!-- All Currencies (filtered) -->
          <optgroup label="All Currencies">
            <option
              v-for="item in filteredRateList"
              :key="`back${item.currency}`"
              :value="item.currency"
              :label="item.currency_name"
            >
              {{ item.currency_name }}
            </option>
          </optgroup>
        </select>
      </div>
    </div>
  </div>
  </div>
</template>

<style scoped>
#container {
  width: 300px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.error-message {
  background-color: rgba(239,68,68,0.08);
  color: var(--color-error);
  padding: var(--space-sm);
  border-radius: var(--radius-sm);
  font-size: 12px;
  margin-bottom: 10px;
  max-width: 250px;
  text-align: center;
}

.loading-indicator {
  color: #ffa500;
  font-size: 14px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.last-updated {
  color: var(--color-muted);
  font-size: var(--font-size-base);
}

.refresh-button {
  padding: 8px 16px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 12px;
  transition: transform 0.12s ease;
}

.refresh-button:hover:not(:disabled) {
  transform: translateY(-1px);
  background-color: var(--color-primary-600);
}

.refresh-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.showcurrency {
  margin: 15px;
}

.showcurrency p {
  color: var(--color-text);
  font-size: 20px;
}

.currencyconverter {
  margin: 5px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.currencyconverter input[type="text"]:not(.filter-input) {
  border-radius: 10px;
  height: 20px;
  padding-left: 10px;
}

.select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.filter-input {
  border-radius: var(--radius-sm);
  padding: 6px 8px;
  font-size: 12px;
  border: 1px solid rgba(255,255,255,0.06);
  background: var(--color-card);
  color: var(--color-text);
  transition: box-shadow 0.16s ease, border-color 0.16s ease;
}

.filter-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(76,175,80,0.12);
}

.currencyconverter select {
  height: 34px;
  border-radius: var(--radius-pill);
  padding-left: 10px;
  background: var(--color-card);
  color: var(--color-text);
}

.app-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-md);
}

.theme-toggle {
  background: transparent;
  border: none;
  color: var(--color-text);
  font-size: 18px;
  cursor: pointer;
}

.card {
  width: 320px;
  padding: var(--space-lg);
  border-radius: var(--radius-md);
  background: var(--color-card);
  box-shadow: var(--shadow-subtle);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
}

</style>
