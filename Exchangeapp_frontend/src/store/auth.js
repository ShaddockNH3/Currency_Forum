import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from '../axios';
export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token'));
    const username = ref(localStorage.getItem('username'));
    const isAuthenticated = computed(() => !!token.value);
    // 简单的JWT解码函数（仅用于获取用户名）
    const decodeJWT = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        }
        catch (error) {
            console.error('JWT decode error:', error);
            return null;
        }
    };
    const login = async (usernameInput, password) => {
        try {
            const response = await axios.post('/auth/login', { username: usernameInput, password });
            const tokenValue = response.data.token;
            // 存储token和用户名
            token.value = tokenValue;
            username.value = usernameInput;
            localStorage.setItem('token', tokenValue);
            localStorage.setItem('username', usernameInput);
            // 设置axios默认headers
            axios.defaults.headers.common['Authorization'] = `Bearer ${tokenValue}`;
        }
        catch (error) {
            throw new Error(`Login failed! ${error}`);
        }
    };
    const register = async (usernameInput, password) => {
        try {
            const response = await axios.post('/auth/register', { username: usernameInput, password });
            const tokenValue = response.data.token;
            // 存储token和用户名
            token.value = tokenValue;
            username.value = usernameInput;
            localStorage.setItem('token', tokenValue);
            localStorage.setItem('username', usernameInput);
            // 设置axios默认headers
            axios.defaults.headers.common['Authorization'] = `Bearer ${tokenValue}`;
        }
        catch (error) {
            throw new Error(`Register failed! ${error}`);
        }
    };
    const logout = () => {
        token.value = null;
        username.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        // 清除axios默认headers
        delete axios.defaults.headers.common['Authorization'];
    };
    // 初始化时设置axios headers
    if (token.value) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
    }
    return {
        token,
        username,
        isAuthenticated,
        login,
        register,
        logout
    };
});
