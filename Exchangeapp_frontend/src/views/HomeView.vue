<template>  
  <el-container class="home-container">  
    <div class="content-wrapper">  
      <h1 class="title">欢迎使用柚影密境</h1>  
      <p class="description">YuShadow Realm - 神秘的数字货币交易与资讯门户</p>
      
      <div class="feature-cards">
        <el-card class="feature-card" shadow="hover">
          <div class="card-content">
            <el-icon class="card-icon"><Money /></el-icon>
            <h3>货币兑换</h3>
            <p>实时汇率查询和货币兑换计算</p>
            <el-button type="primary" @click="goTo('CurrencyExchange')">开始兑换</el-button>
          </div>
        </el-card>

        <el-card class="feature-card" shadow="hover">
          <div class="card-content">
            <el-icon class="card-icon"><Reading /></el-icon>
            <h3>新闻资讯</h3>
            <p>最新的财经新闻和市场动态</p>
            <el-button type="primary" @click="goTo('News')">查看新闻</el-button>
          </div>
        </el-card>

        <el-card class="feature-card" shadow="hover" v-if="authStore.isAuthenticated">
          <div class="card-content">
            <el-icon class="card-icon"><Wallet /></el-icon>
            <h3>数字钱包</h3>
            <p>管理您的多币种数字钱包</p>
            <el-button type="primary" @click="goTo('Wallet')">进入钱包</el-button>
          </div>
        </el-card>

        <el-card class="feature-card" shadow="hover" v-if="!authStore.isAuthenticated">
          <div class="card-content">
            <el-icon class="card-icon"><User /></el-icon>
            <h3>用户注册</h3>
            <p>注册账户享受更多功能</p>
            <el-button type="primary" @click="goTo('Register')">立即注册</el-button>
          </div>
        </el-card>
      </div>
    </div>  
  </el-container>  
</template>  

<script setup lang="ts">   
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import { Money, Reading, Wallet, User } from '@element-plus/icons-vue';

const router = useRouter();
const authStore = useAuthStore();

const goTo = (routeName: string) => {
  router.push({ name: routeName });
};
</script>  
  
<style scoped>  
.home-container {  
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 40px 20px; 
  box-sizing: border-box;
}  
  
.content-wrapper {  
  text-align: center;  
  max-width: 1200px;
  margin: 0 auto; 
}  
  
.title {  
  color: #333;  
  font-size: 42px;  
  font-weight: bold;  
  margin-bottom: 16px;   
}  
  
.description {  
  color: #666;  
  font-size: 20px; 
  line-height: 1.5;
  margin-bottom: 40px;  
}

.feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.feature-card {
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.card-content {
  text-align: center;
  padding: 20px;
}

.card-icon {
  font-size: 48px;
  color: #409eff;
  margin-bottom: 16px;
}

.card-content h3 {
  font-size: 24px;
  color: #333;
  margin-bottom: 12px;
}

.card-content p {
  color: #666;
  font-size: 16px;
  margin-bottom: 20px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .feature-cards {
    grid-template-columns: 1fr;
  }
  
  .title {
    font-size: 32px;
  }
  
  .description {
    font-size: 18px;
  }
}
</style>