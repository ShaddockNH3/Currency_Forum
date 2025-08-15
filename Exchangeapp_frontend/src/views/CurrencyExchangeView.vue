<template>  
  <el-container>  
    <el-main>
      <div class="page-header">
        <h1>货币兑换</h1>
        <el-button 
          v-if="isAdmin" 
          type="primary" 
          @click="showRateManagement = !showRateManagement"
        >
          {{ showRateManagement ? '隐藏' : '显示' }}汇率管理
        </el-button>
      </div>

      <!-- 管理员汇率管理界面 -->
      <el-card v-if="isAdmin && showRateManagement" class="admin-panel" shadow="hover">
        <template #header>
          <div class="card-header">
            <span>汇率管理</span>
            <el-button type="primary" @click="showCreateDialog = true">
              添加汇率
            </el-button>
          </div>
        </template>
        
        <el-table :data="rates" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="fromCurrency" label="从货币" width="100" />
          <el-table-column prop="toCurrency" label="到货币" width="100" />
          <el-table-column prop="rate" label="汇率" width="120">
            <template #default="scope">
              {{ Number(scope.row.rate).toFixed(6) }}
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button size="small" @click="editRate(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteRate(scope.row.id)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 货币兑换表单 -->
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

      <!-- 添加/编辑汇率对话框 -->
      <el-dialog 
        v-model="showCreateDialog" 
        :title="editingRate ? '编辑汇率' : '添加汇率'" 
        width="500px"
      >
        <el-form :model="rateForm" label-width="100px">
          <el-form-item label="从货币" required>
            <el-select v-model="rateForm.fromCurrency" placeholder="选择源货币">
              <el-option label="USD" value="USD" />
              <el-option label="CNY" value="CNY" />
              <el-option label="JPY" value="JPY" />
              <el-option label="EUR" value="EUR" />
              <el-option label="GBP" value="GBP" />
            </el-select>
          </el-form-item>
          <el-form-item label="到货币" required>
            <el-select v-model="rateForm.toCurrency" placeholder="选择目标货币">
              <el-option label="USD" value="USD" />
              <el-option label="CNY" value="CNY" />
              <el-option label="JPY" value="JPY" />
              <el-option label="EUR" value="EUR" />
              <el-option label="GBP" value="GBP" />
            </el-select>
          </el-form-item>
          <el-form-item label="汇率" required>
            <el-input 
              v-model="rateForm.rate" 
              type="number" 
              step="0.000001"
              placeholder="请输入汇率" 
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="closeRateDialog">取消</el-button>
          <el-button type="primary" @click="saveRate">
            {{ editingRate ? '更新' : '添加' }}
          </el-button>
        </template>
      </el-dialog>
    </el-main>
  </el-container>  
</template>  
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { useAuthStore } from '../store/auth';
  import axios from '../axios';
  
  interface ExchangeRate {
    id?: number;
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    created_at?: string;
    updated_at?: string;
  }

  interface RateForm {
    fromCurrency: string;
    toCurrency: string;
    rate: string;
  }
  
  const authStore = useAuthStore();
  
  const form = ref({
    fromCurrency: '',
    toCurrency: '',
    amount: 0,
  });
  
  const result = ref<number | null>(null);
  const currencies = ref<string[]>([]);
  const rates = ref<ExchangeRate[]>([]);
  
  // 管理界面相关
  const showRateManagement = ref(false);
  const showCreateDialog = ref(false);
  const editingRate = ref<ExchangeRate | null>(null);
  const rateForm = ref<RateForm>({
    fromCurrency: '',
    toCurrency: '',
    rate: ''
  });

  // 计算属性：检查是否为管理员
  const isAdmin = computed(() => {
    return authStore.userInfo?.role === 'admin';
  });
  
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

  // 管理功能
  const editRate = (rate: ExchangeRate) => {
    editingRate.value = rate;
    rateForm.value = {
      fromCurrency: rate.fromCurrency,
      toCurrency: rate.toCurrency,
      rate: rate.rate.toString()
    };
    showCreateDialog.value = true;
  };

  const deleteRate = async (id: number) => {
    try {
      await ElMessageBox.confirm('确定要删除这个汇率吗？', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      });
      
      await axios.delete(`/exchangeRates/${id}`);
      await fetchCurrencies();
      ElMessage.success('汇率删除成功！');
    } catch (error) {
      if (error !== 'cancel') {
        console.error('Failed to delete rate:', error);
        ElMessage.error('汇率删除失败');
      }
    }
  };

  const saveRate = async () => {
    try {
      if (!rateForm.value.fromCurrency || !rateForm.value.toCurrency || !rateForm.value.rate) {
        ElMessage.error('请填写所有必需字段');
        return;
      }

      const rateData = {
        fromCurrency: rateForm.value.fromCurrency,
        toCurrency: rateForm.value.toCurrency,
        rate: Number(rateForm.value.rate)
      };

      if (editingRate.value) {
        // 更新汇率
        await axios.put(`/exchangeRates/${editingRate.value.id}`, rateData);
        ElMessage.success('汇率更新成功！');
      } else {
        // 创建新汇率
        await axios.post('/exchangeRates', rateData);
        ElMessage.success('汇率添加成功！');
      }
      
      closeRateDialog();
      await fetchCurrencies();
    } catch (error) {
      console.error('Failed to save rate:', error);
      ElMessage.error(editingRate.value ? '汇率更新失败' : '汇率添加失败');
    }
  };

  const closeRateDialog = () => {
    showCreateDialog.value = false;
    editingRate.value = null;
    rateForm.value = {
      fromCurrency: '',
      toCurrency: '',
      rate: ''
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };
  
  onMounted(fetchCurrencies);
  </script>
  
  <style scoped>
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .page-header h1 {
    margin: 0;
    color: #333;
  }

  .admin-panel {
    margin-bottom: 30px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

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

  .exchange-form .el-form-item {
    margin-bottom: 25px;
  }

  .exchange-form .el-button {
    width: 100%;
    padding: 12px;
    font-size: 16px;
  }

  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      gap: 15px;
      align-items: flex-start;
    }
    
    .admin-panel {
      overflow-x: auto;
    }
  }
  </style>
  