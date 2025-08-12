import axios from 'axios';
const instance = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 10000,
});
// 请求拦截器
instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});
// 响应拦截器
instance.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response?.status === 401) {
        // 清除无效的token
        localStorage.removeItem('token');
        // 可以在这里添加重定向到登录页的逻辑
    }
    return Promise.reject(error);
});
export default instance;
