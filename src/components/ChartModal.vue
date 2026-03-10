<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { fetchHistoricalRates } from '../services/exchangeRateService.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  baseCurrency: {
    type: String,
    default: 'TWD'
  },
  targetCurrency: {
    type: String,
    default: 'USD'
  }
})

// Emits
const emit = defineEmits(['close'])

// Reactive data
const chartData = ref([])
const isLoading = ref(false)
const error = ref(null)
const selectedPeriod = ref(30)

// Chart options
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `匯率: ${context.parsed.y.toFixed(4)}`
        }
      }
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: '日期'
      }
    },
    y: {
      title: {
        display: true,
        text: `1 ${props.baseCurrency} = ? ${props.targetCurrency}`
      },
      beginAtZero: false
    }
  }
})

// Computed chart data
const computedChartData = computed(() => ({
  labels: chartData.value.map(item => {
    const date = new Date(item.date)
    return date.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })
  }),
  datasets: [{
    label: `${props.baseCurrency}/${props.targetCurrency}`,
    data: chartData.value.map(item => item.rate),
    borderColor: 'rgb(75, 192, 192)',
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    fill: true,
    tension: 0.1
  }]
}))

// Methods
const closeModal = () => {
  emit('close')
}

const loadHistoricalData = async (days = selectedPeriod.value) => {
  isLoading.value = true
  error.value = null

  try {
    const data = await fetchHistoricalRates(props.baseCurrency, props.targetCurrency, days)
    chartData.value = data
  } catch (err) {
    error.value = `載入歷史數據失敗: ${err.message}`
    console.error('Error loading historical data:', err)
  } finally {
    isLoading.value = false
  }
}

const changePeriod = (days) => {
  selectedPeriod.value = days
  loadHistoricalData(days)
}

// Watchers
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    loadHistoricalData()
  }
})

watch(() => [props.baseCurrency, props.targetCurrency], () => {
  if (props.isOpen) {
    loadHistoricalData()
  }
})
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>歷史匯率趨勢</h2>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>

      <div class="modal-body">
        <div class="currency-info">
          <p>1 {{ baseCurrency }} = ? {{ targetCurrency }}</p>
          <small class="data-notice">💡 演示數據：基於當前匯率生成的模擬歷史趨勢</small>
        </div>

        <div class="period-selector">
          <button
            v-for="period in [7, 30, 90]"
            :key="period"
            :class="['period-button', { active: selectedPeriod === period }]"
            @click="changePeriod(period)"
          >
            {{ period }}天
          </button>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-else-if="isLoading" class="loading">
          載入中...
        </div>

        <div v-else class="chart-container">
          <Line :data="computedChartData" :options="chartOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  color: #1f2937;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  color: #374151;
}

.modal-body {
  padding: 1rem;
}

.currency-info {
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #374151;
}

.period-selector {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.period-button {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.period-button:hover {
  background: #f9fafb;
}

.period-button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.error-message {
  color: #dc2626;
  text-align: center;
  padding: 1rem;
  background: #fef2f2;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.chart-container {
  height: 400px;
  position: relative;
}

.data-notice {
  display: block;
  margin-top: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}
</style>