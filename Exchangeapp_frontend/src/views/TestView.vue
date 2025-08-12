<template>
  <div class="test-container">
    <h1>API测试页面</h1>
    
    <el-card class="test-card">
      <template #header>
        <span>后端连接测试</span>
      </template>
      
      <div class="test-section">
        <h3>1. 测试后端连接</h3>
        <el-button @click="testBackendConnection" :loading="testingConnection">
          测试连接
        </el-button>
        <div v-if="connectionResult" class="result">
          <el-tag :type="connectionResult.success ? 'success' : 'danger'">
            {{ connectionResult.message }}
          </el-tag>
        </div>
      </div>
      
      <div class="test-section">
        <h3>2. 测试用户注册</h3>
        <el-form :model="testForm" label-width="100px">
          <el-form-item label="测试用户名">
            <el-input v-model="testForm.username" placeholder="输入测试用户名" />
          </el-form-item>
          <el-form-item label="测试密码">
            <el-input v-model="testForm.password" type="password" placeholder="输入测试密码" />
          </el-form-item>
        </el-form>
        <el-button @click="testUserRegistration" :loading="testingRegistration">
          测试注册
        </el-button>
        <div v-if="registrationResult" class="result">
          <el-tag :type="registrationResult.success ? 'success' : 'danger'">
            {{ registrationResult.message }}
          </el-tag>
        </div>
      </div>
      
      <div class="test-section">
        <h3>3. 测试用户登录</h3>
        <el-button @click="testUserLogin" :loading="testingLogin" :disabled="!testForm.username || !testForm.password">
          测试登录
        </el-button>
        <div v-if="loginResult" class="result">
          <el-tag :type="loginResult.success ? 'success' : 'danger'">
            {{ loginResult.message }}
          </el-tag>
        </div>
      </div>
      
      <div class="test-section">
        <h3>4. 测试获取文章列表</h3>
        <el-button @click="testGetArticles" :loading="testingArticles" :disabled="!authStore.isAuthenticated">
          测试获取文章
        </el-button>
        <div v-if="articlesResult" class="result">
          <el-tag :type="articlesResult.success ? 'success' : 'danger'">
            {{ articlesResult.message }}
          </el-tag>
          <div v-if="articlesResult.data" class="data-preview">
            <p>获取到 {{ articlesResult.data.total_articles }} 篇文章</p>
          </div>
        </div>
      </div>
      
      <div class="test-section">
        <h3>5. 测试获取汇率</h3>
        <el-button @click="testGetRates" :loading="testingRates">
          测试获取汇率
        </el-button>
        <div v-if="ratesResult" class="result">
          <el-tag :type="ratesResult.success ? 'success' : 'danger'">
            {{ ratesResult.message }}
          </el-tag>
          <div v-if="ratesResult.data" class="data-preview">
            <p>获取到 {{ ratesResult.data.length }} 个汇率</p>
          </div>
        </div>
      </div>
    </el-card>
    
    <el-card class="test-card">
      <template #header>
        <span>当前状态</span>
      </template>
      
      <div class="status-info">
        <p><strong>认证状态:</strong> {{ authStore.isAuthenticated ? '已登录' : '未登录' }}</p>
        <p v-if="authStore.username"><strong>用户名:</strong> {{ authStore.username }}</p>
        <p v-if="authStore.role"><strong>角色:</strong> {{ authStore.role }}</p>
        <p><strong>Token:</strong> {{ authStore.token ? '已设置' : '未设置' }}</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import axios from '../axios';
import { useAuthStore } from '../store/auth';

const authStore = useAuthStore();

const testForm = reactive({
  username: 'testuser',
  password: 'testpass123'
});

const testingConnection = ref(false);
const testingRegistration = ref(false);
const testingLogin = ref(false);
const testingArticles = ref(false);
const testingRates = ref(false);

const connectionResult = ref<any>(null);
const registrationResult = ref<any>(null);
const loginResult = ref<any>(null);
const articlesResult = ref<any>(null);
const ratesResult = ref<any>(null);

const testBackendConnection = async () => {
  testingConnection.value = true;
  try {
    const response = await axios.get('/');
    connectionResult.value = {
      success: true,
      message: '后端连接成功',
      data: response.data
    };
    ElMessage.success('后端连接成功');
  } catch (error: any) {
    connectionResult.value = {
      success: false,
      message: `连接失败: ${error.message}`,
      error: error
    };
    ElMessage.error('后端连接失败');
  } finally {
    testingConnection.value = false;
  }
};

const testUserRegistration = async () => {
  testingRegistration.value = true;
  try {
    const response = await axios.post('/auth/register', {
      username: testForm.username,
      password: testForm.password
    });
    registrationResult.value = {
      success: true,
      message: '用户注册成功',
      data: response.data
    };
    ElMessage.success('用户注册成功');
  } catch (error: any) {
    registrationResult.value = {
      success: false,
      message: `注册失败: ${error.response?.data?.error || error.message}`,
      error: error
    };
    ElMessage.error('用户注册失败');
  } finally {
    testingRegistration.value = false;
  }
};

const testUserLogin = async () => {
  testingLogin.value = true;
  try {
    const response = await axios.post('/auth/login', {
      username: testForm.username,
      password: testForm.password
    });
    loginResult.value = {
      success: true,
      message: '用户登录成功',
      data: response.data
    };
    ElMessage.success('用户登录成功');
    
    // 更新认证状态
    await authStore.login(testForm.username, testForm.password);
  } catch (error: any) {
    loginResult.value = {
      success: false,
      message: `登录失败: ${error.response?.data?.error || error.message}`,
      error: error
    };
    ElMessage.error('用户登录失败');
  } finally {
    testingLogin.value = false;
  }
};

const testGetArticles = async () => {
  testingArticles.value = true;
  try {
    const response = await axios.get('/articles', {
      params: { page: 1, page_size: 10 }
    });
    articlesResult.value = {
      success: true,
      message: '获取文章成功',
      data: response.data
    };
    ElMessage.success('获取文章成功');
  } catch (error: any) {
    articlesResult.value = {
      success: false,
      message: `获取文章失败: ${error.response?.data?.error || error.message}`,
      error: error
    };
    ElMessage.error('获取文章失败');
  } finally {
    testingArticles.value = false;
  }
};

const testGetRates = async () => {
  testingRates.value = true;
  try {
    const response = await axios.get('/exchangeRates');
    ratesResult.value = {
      success: true,
      message: '获取汇率成功',
      data: response.data
    };
    ElMessage.success('获取汇率成功');
  } catch (error: any) {
    ratesResult.value = {
      success: false,
      message: `获取汇率失败: ${error.response?.data?.error || error.message}`,
      error: error
    };
    ElMessage.error('获取汇率失败');
  } finally {
    testingRates.value = false;
  }
};
</script>

<style scoped>
.test-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.test-card {
  margin-bottom: 20px;
}

.test-section {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 6px;
}

.test-section h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
}

.result {
  margin-top: 10px;
}

.data-preview {
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.status-info p {
  margin: 8px 0;
  color: #666;
}

.status-info strong {
  color: #333;
}
</style>
