<template>
  <div class="auth-container">
    <el-form :model="form" class="auth-form" @submit.prevent="register" :rules="rules" ref="formRef">
      <el-form-item label="用户名" label-width="100px" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="密码" label-width="100px" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item label="邮箱" label-width="100px" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="手机号" label-width="100px" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="管理员密钥" label-width="100px" prop="adminKey">
        <el-input 
          v-model="form.adminKey" 
          placeholder="输入代码创建管理员账号（可选）"
          type="password"
          show-password
        />
        <div class="admin-tip">提示：输入特殊密钥可创建管理员账号</div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../store/auth';
  import { ElMessage, type FormInstance } from 'element-plus';
  
  const form = ref({
    username: '',
    password: '',
    email: '',
    phone: '',
    adminKey: '',
  });

  const formRef = ref<FormInstance>();

  const rules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 20, message: '用户名长度应在3-20个字符', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, message: '密码长度至少6个字符', trigger: 'blur' }
    ],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ]
  };
  
  const authStore = useAuthStore();
  const router = useRouter();
  
  const register = async () => {
    if (!formRef.value) return;
    
    try {
      await formRef.value.validate();
      
      // 处理管理员密钥
      const userData = {
        username: form.value.username,
        password: form.value.password,
        email: form.value.email,
        phone: form.value.phone,
        role: form.value.adminKey === 'Trash-Fish' ? 'admin' : 'user'
      };
      
      await authStore.register(userData);
      router.push({ name: 'Home' });
      
      if (userData.role === 'admin') {
        ElMessage.success('管理员账号注册成功！');
      } else {
        ElMessage.success('注册成功！');
      }
    } catch (error) {
      if (error instanceof Error) {
        ElMessage.error(error.message);
      } else {
        ElMessage.error('注册失败，请重试。');
      }
    }
  };
  </script>
  
  <style scoped>
.auth-container {  
  display: flex;  
  justify-content: center;  
  align-items: center;  
  height: 100vh; 
  background-color: #f5f5f5; 
  padding: 20px;  
  box-sizing: border-box; 
}  
  
.auth-form {  
  width: 100%;  
  max-width: 360px; 
  padding: 20px;  
  background-color: #fff;  
  border-radius: 4px;  
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);  
}

.admin-tip {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
  line-height: 1.4;
}
  </style>
  