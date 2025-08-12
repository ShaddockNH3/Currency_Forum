<template>
  <div id="app">
    <!-- 导航栏 -->
    <el-header class="app-header">
      <div class="header-content">
        <div class="logo" @click="$router.push('/')">
          <h2>蓝鼠兑换</h2>
        </div>
        
        <nav class="nav-links">
          <el-button text @click="$router.push('/')">首页</el-button>
          <el-button text @click="$router.push('/exchange')">货币兑换</el-button>
          <el-button text @click="$router.push('/news')">财经资讯</el-button>
          <el-button text @click="$router.push('/wallets')" v-if="authStore.isAuthenticated">钱包管理</el-button>
          <el-button text @click="$router.push('/test')" v-if="isDevelopment">测试页面</el-button>
        </nav>
        
        <div class="auth-section">
          <template v-if="authStore.isAuthenticated">
            <el-dropdown @command="handleCommand">
              <span class="user-info">
                <el-avatar :size="32" icon="UserFilled" />
                <span class="username">{{ authStore.username || '用户' }}</span>
                <el-icon><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                  <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <el-button text @click="$router.push('/login')">登录</el-button>
            <el-button type="primary" @click="$router.push('/register')">注册</el-button>
          </template>
        </div>
      </div>
    </el-header>
    
    <!-- 主要内容 -->
    <el-main class="app-main">
      <router-view />
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from './store/auth';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { ArrowDown } from '@element-plus/icons-vue';
import { computed } from 'vue';

const authStore = useAuthStore();
const router = useRouter();

const isDevelopment = computed(() => import.meta.env.DEV);

const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      // 跳转到个人资料页面
      router.push(`/users/${authStore.username}`);
      break;
    case 'logout':
      authStore.logout();
      ElMessage.success('已退出登录');
      router.push('/');
      break;
  }
};
</script>

<style>
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

.app-header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.logo {
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.logo:hover {
  opacity: 0.8;
}

.logo h2 {
  margin: 0;
  color: #409eff;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.auth-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.username {
  font-weight: 500;
  color: #333;
}

.app-main {
  padding: 0;
  min-height: calc(100vh - 60px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    padding: 0 15px;
  }
  
  .nav-links {
    gap: 10px;
  }
  
  .nav-links .el-button {
    padding: 8px 12px;
    font-size: 14px;
  }
  
  .logo h2 {
    font-size: 18px;
  }
}
</style>