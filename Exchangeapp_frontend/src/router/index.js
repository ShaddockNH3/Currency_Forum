import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CurrencyExchangeView from '../views/CurrencyExchangeView.vue';
import NewsView from '../views/NewsView.vue';
import NewsDetailView from '../views/NewsDetailView.vue';
import UserProfileView from '../views/UserProfileView.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
const routes = [
    { path: '/', name: 'Home', component: HomeView },
    { path: '/exchange', name: 'CurrencyExchange', component: CurrencyExchangeView },
    { path: '/news', name: 'News', component: NewsView },
    { path: '/news/:id', name: 'NewsDetail', component: NewsDetailView },
    { path: '/users/:username', name: 'UserProfile', component: UserProfileView },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },
];
const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router;
