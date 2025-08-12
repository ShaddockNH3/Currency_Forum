import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

// 请求拦截器
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('请求拦截器: 添加token到请求头:', `Bearer ${token.substring(0, 20)}...`);
    } else {
      console.log('请求拦截器: 未找到token');
    }
    
    // 打印请求信息用于调试
    console.log('发送请求:', config.method?.toUpperCase(), config.url, {
      headers: config.headers,
      data: config.data,
      params: config.params
    });
    
    return config;
  },
  error => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  response => {
    console.log('响应成功:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('响应错误:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      response: error.response?.data
    });
    
    if (error.response?.status === 401) {
      console.log('401错误: 清除token并重定向到登录页');
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      
      // 重定向到登录页
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
