<template>
  <el-container class="wallet-container">
    <el-main>
      <!-- 顶部操作栏 -->
      <div class="top-actions">
        <h2 class="page-title">钱包管理</h2>
        <div class="action-buttons" v-if="authStore.isAuthenticated">
          <el-button type="primary" @click="showWalletForm = true">
            <el-icon><Plus /></el-icon>
            创建钱包
          </el-button>
        </div>
      </div>

      <!-- 钱包列表 -->
      <div v-if="wallets && wallets.length" class="wallets-container">
        <el-card v-for="wallet in wallets" :key="wallet.id" class="wallet-card">
          <div class="wallet-header">
            <div class="wallet-info">
              <h3>{{ wallet.wallet_name }}</h3>
              <p class="wallet-description">{{ wallet.description }}</p>
            </div>
            <div class="wallet-status">
              <el-tag :type="wallet.is_enabled ? 'success' : 'danger'">
                {{ wallet.is_enabled ? '启用' : '禁用' }}
              </el-tag>
            </div>
          </div>
          
          <div class="wallet-details">
            <div class="detail-item">
              <span class="label">总余额:</span>
              <span class="value">{{ wallet.total_balance }} {{ wallet.default_currency }}</span>
            </div>
            <div class="detail-item">
              <span class="label">状态:</span>
              <span class="value">{{ wallet.status }}</span>
            </div>
            <div class="detail-item">
              <span class="label">创建时间:</span>
              <span class="value">{{ formatDate(wallet.created_at) }}</span>
            </div>
          </div>
          
          <div class="wallet-actions">
            <el-button text size="small" @click="viewWalletDetails(wallet)">
              <el-icon><View /></el-icon>
              查看详情
            </el-button>
            <el-button text size="small" @click="editWallet(wallet)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button text size="small" type="danger" @click="deleteWallet(wallet.id)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </div>
        </el-card>
      </div>
      
      <div v-else-if="loading" class="loading">
        <el-loading-component />
      </div>
      <div v-else class="no-data">
        <el-empty description="暂无钱包" />
      </div>
    </el-main>

    <!-- 钱包表单对话框 -->
    <el-dialog
      :title="isEdit ? '编辑钱包' : '创建钱包'"
      v-model="showWalletForm"
      width="50%"
      :before-close="handleClose"
    >
      <el-form :model="walletForm" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="钱包名称" prop="wallet_name">
          <el-input v-model="walletForm.wallet_name" placeholder="请输入钱包名称" />
        </el-form-item>
        
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="walletForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入钱包描述"
          />
        </el-form-item>
        
        <el-form-item label="默认货币" prop="default_currency">
          <el-select v-model="walletForm.default_currency" placeholder="选择默认货币">
            <el-option label="USD" value="USD" />
            <el-option label="EUR" value="EUR" />
            <el-option label="CNY" value="CNY" />
            <el-option label="JPY" value="JPY" />
            <el-option label="GBP" value="GBP" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-select v-model="walletForm.status" placeholder="选择状态">
            <el-option label="活跃" value="active" />
            <el-option label="冻结" value="frozen" />
            <el-option label="关闭" value="closed" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="启用状态" prop="is_enabled">
          <el-switch v-model="walletForm.is_enabled" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            {{ isEdit ? '更新' : '创建' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
import { Plus, Edit, Delete, View } from '@element-plus/icons-vue';
import axios from '../axios';
import { useAuthStore } from '../store/auth';
import type { Wallet } from '../types/Article';

const authStore = useAuthStore();
const router = useRouter();

const wallets = ref<Wallet[]>([]);
const loading = ref(false);
const showWalletForm = ref(false);
const submitting = ref(false);
const editingWallet = ref<Wallet | null>(null);
const formRef = ref<FormInstance>();

const walletForm = reactive({
  wallet_name: '',
  description: '',
  default_currency: 'USD',
  status: 'active',
  is_enabled: true
});

const rules: FormRules = {
  wallet_name: [
    { required: true, message: '请输入钱包名称', trigger: 'blur' },
    { min: 1, max: 50, message: '钱包名称长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  default_currency: [
    { required: true, message: '请选择默认货币', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
};

const isEdit = computed(() => !!editingWallet.value);

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('zh-CN');
};

const fetchWallets = async () => {
  if (!authStore.isAuthenticated) {
    ElMessage.warning('请先登录后再查看钱包');
    return;
  }
  
  loading.value = true;
  try {
    const response = await axios.get<Wallet[]>('/wallets');
    wallets.value = response.data;
  } catch (error: any) {
    console.error('Failed to load wallets:', error);
    if (error.response?.status === 401) {
      ElMessage.error('请先登录');
      router.push('/login');
    } else {
      ElMessage.error('加载钱包失败');
    }
  } finally {
    loading.value = false;
  }
};

const handleClose = () => {
  showWalletForm.value = false;
  editingWallet.value = null;
  // 重置表单
  Object.assign(walletForm, {
    wallet_name: '',
    description: '',
    default_currency: 'USD',
    status: 'active',
    is_enabled: true
  });
};

const editWallet = (wallet: Wallet) => {
  editingWallet.value = wallet;
  Object.assign(walletForm, {
    wallet_name: wallet.wallet_name,
    description: wallet.description,
    default_currency: wallet.default_currency,
    status: wallet.status,
    is_enabled: wallet.is_enabled
  });
  showWalletForm.value = true;
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  
  try {
    const valid = await formRef.value.validate();
    if (!valid) return;
    
    submitting.value = true;
    
    if (isEdit.value && editingWallet.value) {
      // 更新钱包
      await axios.put(`/wallets/${editingWallet.value.id}`, walletForm);
      ElMessage.success('钱包更新成功！');
    } else {
      // 创建钱包
      await axios.post('/wallets', walletForm);
      ElMessage.success('钱包创建成功！');
    }
    
    fetchWallets();
    handleClose();
    
  } catch (error: any) {
    console.error('操作失败:', error);
    ElMessage.error(error.response?.data?.error || '操作失败，请稍后重试');
  } finally {
    submitting.value = false;
  }
};

const deleteWallet = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这个钱包吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    
    await axios.delete(`/wallets/${id}`);
    ElMessage.success('钱包删除成功');
    fetchWallets();
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除钱包失败:', error);
      ElMessage.error('删除钱包失败');
    }
  }
};

const viewWalletDetails = (wallet: Wallet) => {
  // 这里可以跳转到钱包详情页面
  ElMessage.info('钱包详情功能开发中...');
};

// 页面加载时获取钱包列表
fetchWallets();
</script>

<style scoped>
.wallet-container {
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

.wallets-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.wallet-card {
  transition: box-shadow 0.3s ease;
}

.wallet-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.wallet-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.wallet-info h3 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 18px;
}

.wallet-description {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.wallet-details {
  margin-bottom: 15px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.detail-item .label {
  color: #666;
  font-size: 14px;
}

.detail-item .value {
  color: #333;
  font-weight: 500;
}

.wallet-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.no-data {
  text-align: center;
  padding: 60px 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media (max-width: 768px) {
  .wallets-container {
    grid-template-columns: 1fr;
  }
  
  .wallet-header {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
