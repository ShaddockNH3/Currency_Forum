import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const username = ref<string | null>(localStorage.getItem('username'));
  const role = ref<string | null>(localStorage.getItem('role'));

  const isAuthenticated = computed(() => !!token.value);

  const login = async (usernameInput: string, password: string) => {
    try {
      // 创建临时axios实例用于登录（不包含认证头）
      const { default: axios } = await import('../axios');
      const response = await axios.post('/auth/login', { username: usernameInput, password });
      const tokenValue = response.data.token;
      
      // 从JWT中解析用户信息
      const userInfo = parseJWT(tokenValue);
      
      // 存储token和用户信息
      token.value = tokenValue;
      username.value = usernameInput;
      role.value = userInfo?.role || 'user';
      localStorage.setItem('token', tokenValue);
      localStorage.setItem('username', usernameInput);
      localStorage.setItem('role', role.value);
      
      console.log('登录成功，token已保存:', tokenValue.substring(0, 20) + '...');
      console.log('用户角色:', role.value);
    } catch (error) {
      console.error('登录失败:', error);
      throw new Error(`Login failed! ${error}`);
    }
  };

  const register = async (usernameInput: string, password: string) => {
    try {
      // 创建临时axios实例用于注册（不包含认证头）
      const { default: axios } = await import('../axios');
      const response = await axios.post('/auth/register', { username: usernameInput, password });
      const tokenValue = response.data.token;
      
      // 从JWT中解析用户信息
      const userInfo = parseJWT(tokenValue);
      
      // 存储token和用户信息
      token.value = tokenValue;
      username.value = usernameInput;
      role.value = userInfo?.role || 'user';
      localStorage.setItem('token', tokenValue);
      localStorage.setItem('username', usernameInput);
      localStorage.setItem('role', role.value);
      
      console.log('注册成功，token已保存:', tokenValue.substring(0, 20) + '...');
      console.log('用户角色:', role.value);
    } catch (error) {
      console.error('注册失败:', error);
      throw new Error(`Register failed! ${error}`);
    }
  };

  const logout = () => {
    token.value = null;
    username.value = null;
    role.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    
    console.log('已退出登录，token已清除');
  };

  // 简单的JWT解码函数（仅用于获取用户角色）
  const parseJWT = (tokenString: string | null) => {
    if (!tokenString) return null;
    
    try {
      const base64Url = tokenString.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('JWT decode error:', error);
      return null;
    }
  };

  return {
    token,
    username,
    role,
    isAuthenticated,
    login,
    register,
    logout
  };
});
