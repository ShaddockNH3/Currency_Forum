<template>  
  <el-container class="home-container">  
    <div class="content-wrapper">  
      <h1 class="title">欢迎使用蓝鼠兑换</h1>  
      <p class="description">请选择下方的功能进行操作。</p>  
      
      <div class="feature-grid">
        <el-card class="feature-card" @click="navigateTo('/exchange')">
          <div class="feature-icon">💱</div>
          <h3>货币兑换</h3>
          <p>实时汇率查询和货币兑换计算</p>
        </el-card>
        
        <el-card class="feature-card" @click="navigateTo('/news')">
          <div class="feature-icon">📰</div>
          <h3>财经资讯</h3>
          <p>最新财经新闻和市场动态</p>
        </el-card>
        
        <el-card class="feature-card" @click="navigateTo('/wallets')" v-if="authStore.isAuthenticated">
          <div class="feature-icon">💰</div>
          <h3>钱包管理</h3>
          <p>管理您的数字钱包和资产</p>
        </el-card>
        
        <el-card class="feature-card" @click="navigateTo('/login')" v-if="!authStore.isAuthenticated">
          <div class="feature-icon">👤</div>
          <h3>用户中心</h3>
          <p>登录注册和个人资料管理</p>
        </el-card>
        
        <el-card class="feature-card" @click="navigateTo('/register')" v-if="!authStore.isAuthenticated">
          <div class="feature-icon">🔐</div>
          <h3>注册账户</h3>
          <p>创建新账户开始使用服务</p>
        </el-card>
      </div>
    </div>  
  </el-container>  
</template>  
  
<script setup lang="ts">   
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';

const router = useRouter();
const authStore = useAuthStore();

const navigateTo = (path: string) => {
  router.push(path);
};
</script>  
  
<style scoped>  
.home-container {  
  display: flex;  
  justify-content: center;  
  align-items: center;  
  min-height: 100vh; 
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px; 
  box-sizing: border-box;
}  
  
.content-wrapper {  
  text-align: center;  
  max-width: 1000px; 
  width: 100%;
}  
  
.title {  
  color: white;  
  font-size: 3em;  
  font-weight: bold;  
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}  
  
.description {  
  color: rgba(255,255,255,0.9);  
  font-size: 1.2em; 
  line-height: 1.5;
  margin-bottom: 40px;
}  

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 40px;
}

.feature-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.feature-icon {
  font-size: 3em;
  margin-bottom: 15px;
}

.feature-card h3 {
  color: #333;
  margin-bottom: 10px;
  font-size: 1.3em;
}

.feature-card p {
  color: #666;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .title {
    font-size: 2em;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}
</style>