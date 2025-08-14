<template>  
  <el-container>  
    <el-form :model="form" class="exchange-form">  
      <el-form-item label="从货币" label-width="80px">  
        <el-select v-model="form.fromCurrency" placeholder="选择货币">  
          <el-option v-for="currency in currencies" :key="currency" :label="currency" :value="currency" />  
        </el-select>  
      </el-form-item>  
      <el-form-item label="到货币" label-width="80px">  
        <el-select v-model="form.toCurrency" placeholder="选择货币">  
          <el-option v-for="currency in currencies" :key="currency" :label="currency" :value="currency" />  
        </el-select>  
      </el-form-item>  
      <el-form-item label="金额" label-width="80px">  
        <el-input v-model="form.amount" type="number" placeholder="输入金额" />  
      </el-form-item>  
      <el-form-item>  
        <el-button type="primary" @click="exchange">兑换</el-button>  
      </el-form-item>  
    </el-form>  
    <div v-if="result !== null" class="result">  
      <p class="result-text">
        {{ form.amount }} {{ form.fromCurrency }} = 
        <span class="result-amount">{{ result }}</span> {{ form.toCurrency }}
      </p>  
    </div>
    <div v-else-if="form.fromCurrency && form.toCurrency && form.amount" class="result error">
      <p>未找到 {{ form.fromCurrency }} 到 {{ form.toCurrency }} 的汇率</p>
    </div>  
  </el-container>  
</template>  
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import axios from '../axios';
  
  interface ExchangeRate {
    fromCurrency: string;
    toCurrency: string;
    rate: number;
  }
  
  const form = ref({
    fromCurrency: '',
    toCurrency: '',
    amount: 0,
  });
  
  const result = ref<number | null>(null);
  const currencies = ref<string[]>([]);
  const rates = ref<ExchangeRate[]>([]);
  
  const fetchCurrencies = async () => {
    try{
      const response = await axios.get<ExchangeRate[]>('/exchangeRates');
      rates.value = response.data || [];
      currencies.value = [...new Set(response.data?.map((rate: ExchangeRate) => [rate.fromCurrency, rate.toCurrency]).flat() || [])];
    }catch(error){
      console.log('Failed to load currencies', error);
      // 设置默认货币列表以防API失败
      currencies.value = ['USD', 'CNY', 'JPY', 'EUR', 'GBP'];
    }
  };
  
  const exchange = () => {
    if (!form.value.fromCurrency || !form.value.toCurrency || !form.value.amount) {
      result.value = null;
      return;
    }

    const rate = rates.value.find(
      (rate) => rate.fromCurrency === form.value.fromCurrency && rate.toCurrency === form.value.toCurrency
    )?.rate;
  
    if (rate) {
      result.value = Number((form.value.amount * rate).toFixed(4));
    } else {
      result.value = null;
    }
  };
  
  onMounted(fetchCurrencies);
  </script>
  
  <style scoped>
  .exchange-form {  
  width: 100%;  
  max-width: 600px;  
  margin: 20px auto;  
  padding: 30px;  
  background-color: white;  
  border-radius: 12px;  
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);  
}  
  
.result {  
  margin: 20px auto;
  max-width: 600px;
  padding: 25px;  
  background-color: #e8f4fd;  
  border-radius: 12px;  
  text-align: center;
  border-left: 4px solid #409eff;
}

.result.error {
  background-color: #fef0f0;
  border-left-color: #f56c6c;
  color: #f56c6c;
}

.result-text {
  font-size: 20px;
  color: #333;
  margin: 0;
}

.result-amount {
  font-weight: bold;
  color: #409eff;
  font-size: 24px;
}

.el-form-item {
  margin-bottom: 25px;
}

.el-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
}
  </style>
  