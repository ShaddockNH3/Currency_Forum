<template>
  <div class="auth-container">
    <el-form :model="form" :rules="rules" ref="formRef" class="auth-form" @submit.prevent="register">
      <h2 class="auth-title">用户注册</h2>
      
      <el-form-item label="用户名" label-width="80px" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>
      
      <el-form-item label="密码" label-width="80px" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码" />
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" native-type="submit" :loading="loading" class="register-btn">
          {{ loading ? '注册中...' : '注册' }}
        </el-button>
      </el-form-item>
      
      <div class="auth-links">
        <el-link @click="$router.push('/login')">已有账户？立即登录</el-link>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';

const form = ref({
  username: '',
  password: '',
});

const formRef = ref<FormInstance>();
const loading = ref(false);
const authStore = useAuthStore();
const router = useRouter();

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 个字符', trigger: 'blur' }
  ]
};

const register = async () => {
  if (!formRef.value) return;
  
  try {
    const valid = await formRef.value.validate();
    if (!valid) return;
    
    loading.value = true;
    console.log('开始注册，用户名:', form.value.username);
    
    await authStore.register(form.value.username, form.value.password);
    
    console.log('注册成功，准备跳转到文章页面');
    ElMessage.success('注册成功！');
    
    // 等待一下确保状态更新
    setTimeout(() => {
      router.push({ name: 'News' });
    }, 100);
    
  } catch (error: any) {
    console.error('注册失败:', error);
    ElMessage.error(error.message || '注册失败，请检查用户名和密码。');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  box-sizing: border-box;
}

.auth-form {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.auth-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.register-btn {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

.auth-links {
  text-align: center;
  margin-top: 20px;
}
</style>
  