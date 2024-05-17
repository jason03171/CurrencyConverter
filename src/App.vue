<script setup>
import axios from 'axios';
import { onMounted, ref, reactive } from 'vue'

onMounted(async () => {
  await getExchangeRate()
  setDefalut('USD')
})

const rateLists = ref([{
  currency_name: '新台幣',
  currency: 'TWD',
  cash: 1
}])

// 取得匯率
const getExchangeRate = () => {
  return axios.get('/CurrencyConverter/exchange_rate.json').then((res) => {
    const newRates = res.data.map(item => {
      return {
        currency_name: item.currency.split(' ')[0],
        currency: item.currency.split(' ')[1].replace(/\(|\)/g, ''),
        cash: parseFloat(item.cash_ask)
      }
    })
    rateLists.value = rateLists.value.concat(newRates)
  }).catch((err) => {
    console.log(err)
  })
}

const front = reactive({
  currency: 'TWD',
  rate: 1,
  input: 1
})

const back = reactive({})

// 設定預設匯率
const setDefalut = (defaultCurrency) => {
  setCurrency('back', defaultCurrency)
}

const targets = { // targets 集合
  front,
  back
}
// 設定匯率
const setCurrency = (target, currency) => {
  const tempRate = rateLists.value.filter(item => item.currency === currency)[0]
  targets[target].currency = tempRate.currency
  targets[target].rate = tempRate.cash
  calcExchangeRate(target)
}

// 變更匯率
const changeCurrency = (target) => {
  setCurrency(target, targets[target].currency)
}

// 
const calcExchangeRate = (target) => {
  const otherTarget = target === 'front' ? 'back' : 'front'
  targets[target].input = parseFloat(parseFloat((targets[otherTarget].input * targets[otherTarget].rate) / targets[target].rate).toFixed(4))
}


</script>

<template>
  <div id="container">
    <div class="showcurrency">
      <p>
        1 {{front.currency}} = {{parseFloat(parseFloat(front.rate /
        back.rate).toFixed(4))}} {{back.currency}}
      </p>
    </div>
    <div class="currencyconverter">
      <input
        type="text"
        v-model="front.input"
        @input="calcExchangeRate('back');"
      />
      <select v-model="front.currency" @change="changeCurrency('front')">
        <option
          v-for="item in rateLists"
          :key="`front${item.currency}`"
          :value="item.currency"
          :label="item.currency_name"
        >
          {{ item.currency_name }}
        </option>
      </select>
    </div>
    <div class="currencyconverter">
      <input
        type="text"
        v-model="back.input"
        @input="calcExchangeRate('front');"
      />
      <select v-model="back.currency" @change="changeCurrency('back')">
        <option
          v-for="item in rateLists"
          :key="`front${item.currency}`"
          :value="item.currency"
          :label="item.currency_name"
        >
          {{ item.currency_name }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
#container {
  width: 300px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.showcurrency {
  margin: 15px;
}

.showcurrency p {
  color: white;
  font-size: 20px;
}

.currencyconverter {
  margin: 5px;
}

.currencyconverter input {
  border-radius: 10px;
  height: 20px;
  padding-left: 10px;
}

.currencyconverter select{
  height: 26px;
  border-radius: 20px;
  padding-left: 5px;
}

</style>
