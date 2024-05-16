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
  const tempRate = rateLists.value.filter(item => item.currency === defaultCurrency)[0]
  back.currency = tempRate.currency
  back.rate = tempRate.cash
  back.input = tempRate.cash
}

const calcExchangeRate = (target) => {
  console.log(target)
}

const changeCurrency = (target) => {
  console.log(front)
  console.log(back)
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
        @input="calcExchangeRate('front');"
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
        @input="calcExchangeRate('back');"
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
