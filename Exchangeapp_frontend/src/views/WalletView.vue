<template>
  <el-container class="wallet-container">
    <el-main>
      <div class="wallet-header">
        <h1>数字钱包</h1>
        <el-button type="primary" @click="createWalletVisible = true" v-if="!wallet">
          创建钱包
        </el-button>
      </div>

      <!-- 钱包信息 -->
      <el-card v-if="wallet" class="wallet-info" shadow="hover">
        <template #header>
          <div class="card-header">
            <span>{{ wallet.wallet_name }}</span>
            <el-button type="text" @click="editWalletVisible = true">编辑</el-button>
          </div>
        </template>
        <div class="wallet-details">
          <p><strong>描述:</strong> {{ wallet.description || '无' }}</p>
          <p><strong>默认货币:</strong> {{ wallet.default_currency }}</p>
          <p><strong>状态:</strong> 
            <el-tag :type="wallet.status === 'active' ? 'success' : 'danger'">
              {{ wallet.status === 'active' ? '正常' : '冻结' }}
            </el-tag>
          </p>
        </div>
      </el-card>

      <!-- 余额展示 -->
      <el-card v-if="wallet && wallet.balances.length" class="balance-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span>账户余额</span>
            <el-button type="primary" @click="depositVisible = true">充值</el-button>
          </div>
        </template>
        <div class="balance-grid">
          <div v-for="balance in wallet.balances" :key="balance.currency_code" class="balance-item">
            <div class="currency-code">{{ balance.currency_code }}</div>
            <div class="amount">{{ balance.amount }}</div>
            <div class="actions">
              <el-button size="small" @click="startWithdraw(balance)">取出</el-button>
              <el-button size="small" @click="startExchange(balance)">兑换</el-button>
              <el-button size="small" @click="startTransfer(balance)">转账</el-button>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 交易记录 -->
      <el-card v-if="bills.length" class="bills-card" shadow="hover">
        <template #header>
          <span>交易记录</span>
        </template>
        <el-table :data="bills" style="width: 100%">
          <el-table-column prop="TransactionType" label="类型" width="100">
            <template #default="scope">
              <el-tag :type="getTransactionTypeColor(scope.row.TransactionType)">
                {{ getTransactionTypeName(scope.row.TransactionType) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="Amount" label="金额" width="120" />
          <el-table-column prop="CurrencyCode" label="货币" width="80" />
          <el-table-column prop="Description" label="描述" />
          <el-table-column prop="Status" label="状态" width="80">
            <template #default="scope">
              <el-tag :type="scope.row.Status === 'completed' ? 'success' : 'warning'">
                {{ scope.row.Status === 'completed' ? '完成' : '处理中' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="CreatedAt" label="时间" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.CreatedAt) }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 创建钱包对话框 -->
      <el-dialog v-model="createWalletVisible" title="创建钱包" width="500px">
        <el-form :model="walletForm" label-width="120px">
          <el-form-item label="钱包名称" required>
            <el-input v-model="walletForm.wallet_name" placeholder="请输入钱包名称" />
          </el-form-item>
          <el-form-item label="钱包描述">
            <el-input v-model="walletForm.wallet_description" type="textarea" placeholder="请输入钱包描述" />
          </el-form-item>
          <el-form-item label="默认货币" required>
            <el-select v-model="walletForm.default_currency" placeholder="选择默认货币">
              <el-option label="人民币 (CNY)" value="CNY" />
              <el-option label="美元 (USD)" value="USD" />
              <el-option label="日元 (JPY)" value="JPY" />
              <el-option label="欧元 (EUR)" value="EUR" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="createWalletVisible = false">取消</el-button>
          <el-button type="primary" @click="createWallet">创建</el-button>
        </template>
      </el-dialog>

      <!-- 充值对话框 -->
      <el-dialog v-model="depositVisible" title="充值" width="400px">
        <el-form :model="depositForm" label-width="80px">
          <el-form-item label="金额" required>
            <el-input v-model="depositForm.amount" placeholder="请输入充值金额" />
          </el-form-item>
          <el-form-item label="货币" required>
            <el-select v-model="depositForm.currency_code" placeholder="选择货币">
              <el-option label="CNY" value="CNY" />
              <el-option label="USD" value="USD" />
              <el-option label="JPY" value="JPY" />
              <el-option label="EUR" value="EUR" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="depositForm.description" placeholder="可选" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="depositVisible = false">取消</el-button>
          <el-button type="primary" @click="deposit">确认充值</el-button>
        </template>
      </el-dialog>

      <!-- 取出对话框 -->
      <el-dialog v-model="withdrawVisible" title="取出" width="400px">
        <el-form :model="withdrawForm" label-width="80px">
          <el-form-item label="金额" required>
            <el-input v-model="withdrawForm.amount" placeholder="请输入取出金额" />
          </el-form-item>
          <el-form-item label="货币" required>
            <el-input v-model="withdrawForm.currency_code" readonly />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="withdrawForm.description" placeholder="可选" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="withdrawVisible = false">取消</el-button>
          <el-button type="primary" @click="withdraw">确认取出</el-button>
        </template>
      </el-dialog>

      <!-- 兑换对话框 -->
      <el-dialog v-model="exchangeVisible" title="货币兑换" width="400px">
        <el-form :model="exchangeForm" label-width="100px">
          <el-form-item label="兑换金额" required>
            <el-input v-model="exchangeForm.amount" placeholder="请输入兑换金额" />
          </el-form-item>
          <el-form-item label="源货币" required>
            <el-input v-model="exchangeForm.from_currency" readonly />
          </el-form-item>
          <el-form-item label="目标货币" required>
            <el-select v-model="exchangeForm.to_currency" placeholder="选择目标货币">
              <el-option label="CNY" value="CNY" />
              <el-option label="USD" value="USD" />
              <el-option label="JPY" value="JPY" />
              <el-option label="EUR" value="EUR" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="exchangeForm.description" placeholder="可选" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="exchangeVisible = false">取消</el-button>
          <el-button type="primary" @click="exchange">确认兑换</el-button>
        </template>
      </el-dialog>

      <!-- 转账对话框 -->
      <el-dialog v-model="transferVisible" title="转账" width="400px">
        <el-form :model="transferForm" label-width="100px">
          <el-form-item label="转账金额" required>
            <el-input v-model="transferForm.amount" placeholder="请输入转账金额" />
          </el-form-item>
          <el-form-item label="货币类型" required>
            <el-input v-model="transferForm.currency_code" readonly />
          </el-form-item>
          <el-form-item label="收款人" required>
            <el-input v-model="transferForm.to_username" placeholder="请输入收款人用户名或用户ID" />
            <div class="input-tip">支持输入用户名或用户ID</div>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="transferForm.description" placeholder="可选" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="transferVisible = false">取消</el-button>
          <el-button type="primary" @click="transfer">确认转账</el-button>
        </template>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import axios from '../axios';
import type {
  WalletDTO,
  WalletInput,
  WalletBalanceDTO,
  BillDTO,
  DepositInput,
  WithdrawInput,
  ExchangeInput,
  TransferInput
} from '../types/Wallet';

const wallet = ref<WalletDTO | null>(null);
const bills = ref<BillDTO[]>([]);

// 对话框显示状态
const createWalletVisible = ref(false);
const editWalletVisible = ref(false);
const depositVisible = ref(false);
const withdrawVisible = ref(false);
const exchangeVisible = ref(false);
const transferVisible = ref(false);

// 表单数据
const walletForm = ref<WalletInput>({
  wallet_name: '',
  wallet_description: '',
  default_currency: 'CNY'
});

const depositForm = ref<DepositInput>({
  amount: '',
  currency_code: 'CNY',
  description: ''
});

const withdrawForm = ref<WithdrawInput>({
  amount: '',
  currency_code: '',
  description: ''
});

const exchangeForm = ref<ExchangeInput>({
  amount: '',
  from_currency: '',
  to_currency: '',
  description: ''
});

const transferForm = ref<TransferInput>({
  to_username: '',
  amount: '',
  currency_code: '',
  description: ''
});

// 获取钱包信息
const fetchWallet = async () => {
  try {
    const response = await axios.get<WalletDTO>('/wallets');
    wallet.value = response.data;
    console.log('钱包信息:', response.data);
  } catch (error: any) {
    console.error('Failed to load wallet:', error);
    if (error.response?.status === 404) {
      console.log('用户还没有钱包');
      wallet.value = null;
    } else {
      ElMessage.error('加载钱包信息失败');
    }
  }
};

// 获取账单
const fetchBills = async () => {
  try {
    const response = await axios.get<BillDTO[]>('/wallets/bills');
    bills.value = response.data || [];
  } catch (error) {
    console.error('Failed to load bills:', error);
  }
};

// 创建钱包
const createWallet = async () => {
  try {
    console.log('创建钱包请求数据:', walletForm.value);
    const response = await axios.post('/wallets', walletForm.value);
    console.log('钱包创建成功响应:', response.data);
    createWalletVisible.value = false;
    await fetchWallet();
    ElMessage.success('钱包创建成功！');
    // 重置表单
    walletForm.value = {
      wallet_name: '',
      wallet_description: '',
      default_currency: 'CNY'
    };
  } catch (error: any) {
    console.error('钱包创建失败:', error);
    if (error.response?.data?.error) {
      ElMessage.error(`钱包创建失败: ${error.response.data.error}`);
    } else {
      ElMessage.error('钱包创建失败');
    }
  }
};

// 充值
const deposit = async () => {
  try {
    await axios.post('/wallets/deposit', depositForm.value);
    depositVisible.value = false;
    await fetchWallet();
    await fetchBills();
    ElMessage.success('充值成功！');
    // 重置表单
    depositForm.value = { amount: '', currency_code: 'CNY', description: '' };
  } catch (error) {
    ElMessage.error('充值失败');
  }
};

// 取出
const withdraw = async () => {
  try {
    await axios.post('/wallets/withdraw', withdrawForm.value);
    withdrawVisible.value = false;
    await fetchWallet();
    await fetchBills();
    ElMessage.success('取出成功！');
  } catch (error) {
    ElMessage.error('取出失败');
  }
};

// 兑换
const exchange = async () => {
  try {
    await axios.post('/wallets/exchange', exchangeForm.value);
    exchangeVisible.value = false;
    await fetchWallet();
    await fetchBills();
    ElMessage.success('兑换成功！');
  } catch (error) {
    ElMessage.error('兑换失败');
  }
};

// 转账
const transfer = async () => {
  try {
    const transferData: any = {
      amount: transferForm.value.amount,
      currency_code: transferForm.value.currency_code,
      description: transferForm.value.description
    };
    
    // 判断输入的是用户名还是用户ID
    if (transferForm.value.to_username) {
      if (/^\d+$/.test(transferForm.value.to_username)) {
        // 如果是纯数字，作为用户ID处理
        transferData.to_user_id = Number(transferForm.value.to_username);
      } else {
        // 否则作为用户名处理
        transferData.to_username = transferForm.value.to_username;
      }
    }
    
    await axios.post('/wallets/transfer', transferData);
    transferVisible.value = false;
    await fetchWallet();
    await fetchBills();
    ElMessage.success('转账成功！');
  } catch (error) {
    ElMessage.error('转账失败');
  }
};

// 启动取出操作
const startWithdraw = (balance: WalletBalanceDTO) => {
  withdrawForm.value = {
    amount: '',
    currency_code: balance.currency_code,
    description: ''
  };
  withdrawVisible.value = true;
};

// 启动兑换操作
const startExchange = (balance: WalletBalanceDTO) => {
  exchangeForm.value = {
    amount: '',
    from_currency: balance.currency_code,
    to_currency: '',
    description: ''
  };
  exchangeVisible.value = true;
};

// 启动转账操作
const startTransfer = (balance: WalletBalanceDTO) => {
  transferForm.value = {
    to_username: '',
    amount: '',
    currency_code: balance.currency_code,
    description: ''
  };
  transferVisible.value = true;
};

// 工具函数
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN');
};

const getTransactionTypeName = (type: string) => {
  const typeMap: Record<string, string> = {
    deposit: '充值',
    withdraw: '取出',
    exchange: '兑换',
    transfer: '转账'
  };
  return typeMap[type] || type;
};

const getTransactionTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    deposit: 'success',
    withdraw: 'warning',
    exchange: 'primary',
    transfer: 'info'
  };
  return colorMap[type] || 'default';
};

onMounted(() => {
  fetchWallet();
  fetchBills();
});
</script>

<style scoped>
.wallet-container {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.wallet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.wallet-header h1 {
  margin: 0;
  color: #333;
}

.wallet-info, .balance-card, .bills-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wallet-details p {
  margin: 10px 0;
  color: #555;
}

.balance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.balance-item {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #e9ecef;
}

.currency-code {
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 10px;
}

.amount {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.input-tip {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .balance-grid {
    grid-template-columns: 1fr;
  }
  
  .actions {
    flex-direction: column;
  }
}
</style>
