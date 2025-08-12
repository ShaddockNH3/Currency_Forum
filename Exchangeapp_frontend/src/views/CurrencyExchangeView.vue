<template>  
  <el-container class="exchange-container">  
    <el-main>
      <!-- 顶部操作栏 -->
      <div class="top-actions">
        <h2 class="page-title">货币兑换</h2>
        <div class="action-buttons" v-if="authStore.isAuthenticated && authStore.role === 'admin'">
          <el-button type="primary" @click="showRateForm = true">
            <el-icon><Plus /></el-icon>
            添加汇率
          </el-button>
        </div>
      </div>

      <!-- 汇率列表 -->
      <el-card class="rates-card" v-if="rates.length > 0">
        <template #header>
          <div class="card-header">
            <span>当前汇率</span>
            <el-button text @click="refreshRates" :loading="loading">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
          </div>
        </template>
        
        <el-table :data="rates" style="width: 100%">
          <el-table-column prop="fromCurrency" label="从货币" width="120" />
          <el-table-column prop="toCurrency" label="到货币" width="120" />
          <el-table-column prop="rate" label="汇率" width="150">
            <template #default="scope">
              {{ scope.row.rate.toFixed(6) }}
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" />
          <el-table-column label="操作" width="150" v-if="authStore.isAuthenticated && authStore.role === 'admin'">
            <template #default="scope">
              <el-button text size="small" @click="editRate(scope.row)">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button text size="small" type="danger" @click="deleteRate(scope.row.id)">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 兑换计算器 -->
      <el-card class="calculator-card">
        <template #header>
          <span>汇率计算器</span>
        </template>
        
        <el-form :model="form" class="exchange-form" label-width="80px">  
          <el-form-item label="从货币">  
            <el-select v-model="form.fromCurrency" placeholder="选择货币" @change="onCurrencyChange">  
              <el-option v-for="currency in currencies" :key="currency" :label="currency" :value="currency" />  
            </el-select>  
          </el-form-item>  
          
          <el-form-item label="到货币">  
            <div class="currency-select-container">
              <el-select v-model="form.toCurrency" placeholder="选择货币" @change="onCurrencyChange">  
                <el-option v-for="currency in currencies" :key="currency" :label="currency" :value="currency" />  
              </el-select>
              <el-button @click="swapCurrencies" class="swap-button" :disabled="!form.fromCurrency || !form.toCurrency">
                <el-icon><Refresh /></el-icon>
                交换
              </el-button>
            </div>
          </el-form-item>  
          
          <el-form-item label="金额">  
            <el-input-number v-model="form.amount" :precision="2" :min="0" placeholder="输入金额" @change="calculateResult" />  
          </el-form-item>  
          
          <el-form-item>  
            <el-button type="primary" @click="calculateResult" :disabled="!canCalculate">计算兑换</el-button>  
          </el-form-item>  
        </el-form>  
        
        <div v-if="result !== null" class="result">  
          <h3>兑换结果</h3>
          <p class="result-amount">{{ form.amount }} {{ form.fromCurrency }} = {{ result.toFixed(2) }} {{ form.toCurrency }}</p>
          <p class="result-rate">汇率: 1 {{ form.fromCurrency }} = {{ currentRate.toFixed(6) }} {{ form.toCurrency }}</p>
        </div>  
      </el-card>
    </el-main>

    <!-- 汇率表单对话框 -->
    <ExchangeRateForm
      v-model:visible="showRateForm"
      :exchangeRate="editingRate"
      @success="handleRateSuccess"
    />
  </el-container>  
</template>  
  
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Edit, Delete, Refresh } from '@element-plus/icons-vue';
import axios from '../axios';
import { useAuthStore } from '../store/auth';
import ExchangeRateForm from '../components/ExchangeRateForm.vue';
import type { ExchangeRate } from '../types/Article';

const authStore = useAuthStore();
const form = ref({
  fromCurrency: '',
  toCurrency: '',
  amount: 1,
});

const result = ref<number | null>(null);
const currencies = ref<string[]>([]);
const rates = ref<ExchangeRate[]>([]);
const loading = ref(false);
const showRateForm = ref(false);
const editingRate = ref<ExchangeRate | null>(null);

const canCalculate = computed(() => {
  return form.value.fromCurrency && 
         form.value.toCurrency && 
         form.value.amount > 0 && 
         form.value.fromCurrency !== form.value.toCurrency &&
         currentRate.value > 0;
});

const currentRate = computed(() => {
  // 查找正向汇率
  let rate = rates.value.find(
    (rate) => rate.fromCurrency === form.value.fromCurrency && rate.toCurrency === form.value.toCurrency
  );
  
  if (rate) {
    return rate.rate;
  }
  
  // 如果正向汇率不存在，查找反向汇率并计算倒数
  rate = rates.value.find(
    (rate) => rate.fromCurrency === form.value.toCurrency && rate.toCurrency === form.value.fromCurrency
  );
  
  if (rate) {
    return 1 / rate.rate;
  }
  
  return 0;
});

const fetchRates = async () => {
  try {
    loading.value = true;
    const response = await axios.get<ExchangeRate[]>('/exchangeRates');
    rates.value = response.data;
    
    // 提取所有货币代码
    const allCurrencies = new Set<string>();
    response.data.forEach(rate => {
      allCurrencies.add(rate.fromCurrency);
      allCurrencies.add(rate.toCurrency);
    });
    currencies.value = Array.from(allCurrencies).sort();
    
    // 设置默认货币
    if (currencies.value.length > 0 && !form.value.fromCurrency) {
      form.value.fromCurrency = currencies.value[0];
    }
    if (currencies.value.length > 1 && !form.value.toCurrency) {
      form.value.toCurrency = currencies.value[1];
    }
  } catch (error) {
    console.log('Failed to load currencies', error);
    ElMessage.error('加载汇率失败');
  } finally {
    loading.value = false;
  }
};

const refreshRates = () => {
  fetchRates();
};

const onCurrencyChange = () => {
  calculateResult();
};

const calculateResult = () => {
  if (!canCalculate.value) {
    result.value = null;
    return;
  }
  
  result.value = form.value.amount * currentRate.value;
};

const editRate = (rate: ExchangeRate) => {
  editingRate.value = rate;
  showRateForm.value = true;
};

const deleteRate = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这个汇率吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    
    console.log('正在删除汇率，ID:', id);
    const response = await axios.delete(`/exchangeRates/${id}`);
    console.log('删除汇率响应:', response);
    
    ElMessage.success('汇率删除成功');
    fetchRates();
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除汇率失败:', error);
      console.error('错误详情:', error.response?.data);
      ElMessage.error(error.response?.data?.error || '删除汇率失败');
    }
  }
};

const handleRateSuccess = () => {
  console.log('汇率操作成功，刷新列表');
  fetchRates();
  editingRate.value = null;
};

const swapCurrencies = () => {
  const temp = form.value.fromCurrency;
  form.value.fromCurrency = form.value.toCurrency;
  form.value.toCurrency = temp;
  calculateResult();
};

onMounted(fetchRates);
</script>
  
<style scoped>
.exchange-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.top-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.page-title {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.rates-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.calculator-card {
  margin-bottom: 20px;
}

.exchange-form {  
  width: 100%;  
  max-width: 400px;  
  margin: 0 auto;  
  padding: 20px;  
}  
  
.result {  
  margin-top: 20px;  
  padding: 20px;  
  background-color: #f0f8ff;  
  border-radius: 8px;  
  text-align: center;  
}  

.result h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.result-amount {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin: 10px 0;
}

.result-rate {
  font-size: 16px;
  color: #666;
  margin: 5px 0;
}

.currency-select-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.swap-button {
  flex-shrink: 0;
}
</style>
  