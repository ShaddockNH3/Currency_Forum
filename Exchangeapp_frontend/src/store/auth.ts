import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from '../axios';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const userInfo = ref<{
    username: string;
    role: string;
  } | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  const login = async (loginField: string, password: string) => {
    try {
      const response = await axios.post('/auth/login', { loginField, password });
      token.value = response.data.token;
      localStorage.setItem('token', token.value || '');
      
      // 保存用户信息到localStorage
      if (response.data.user) {
        userInfo.value = {
          username: response.data.user.username,
          role: response.data.user.role
        };
        localStorage.setItem('userInfo', JSON.stringify(userInfo.value));
      } else {
        // 如果后端没有返回用户信息，保存登录字段作为用户名
        userInfo.value = {
          username: loginField,
          role: 'user'
        };
        localStorage.setItem('userInfo', JSON.stringify(userInfo.value));
      }
    } catch (error) {
      throw new Error(`Login failed! ${error}`);
    }
  };

  const register = async (userData: {
    username: string;
    password: string;
    email: string;
    phone: string;
    role?: string;
  }) => {
    try {
      const requestData = {
        ...userData,
        role: userData.role || 'user'
      };
      const response = await axios.post('/auth/register', requestData);
      token.value = response.data.token;
      localStorage.setItem('token', token.value || '');
      
      // 保存用户信息
      userInfo.value = {
        username: userData.username,
        role: userData.role || 'user'
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value));
    } catch (error) {
      throw new Error(`Register failed! ${error}`);
    }
  };

  const logout = () => {
    token.value = null;
    userInfo.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
  };

  // 初始化时从localStorage恢复用户信息
  const initUserInfo = () => {
    const savedUserInfo = localStorage.getItem('userInfo');
    if (savedUserInfo) {
      try {
        userInfo.value = JSON.parse(savedUserInfo);
      } catch (error) {
        console.error('Failed to parse user info from localStorage');
        localStorage.removeItem('userInfo');
      }
    }
  };

  // 立即初始化
  initUserInfo();

  return {
    token,
    userInfo,
    isAuthenticated,
    login,
    register,
    logout,
    initUserInfo
  };
});
