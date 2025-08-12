<template>
  <el-container>
    <el-main>
      <div v-if="loading" class="loading">
        <el-loading-component />
      </div>
      <el-card v-else-if="article" class="article-detail">
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-meta">
          <span class="author">作者: {{ article.author }}</span>
          <span class="date">发布时间: {{ formatDate(article.created_at) }}</span>
        </div>
        <div class="article-content">
          <p>{{ article.content }}</p>
        </div>
        <div class="article-actions">
          <el-button type="primary" @click="likeArticle" :loading="liking">
            <el-icon><Star /></el-icon>
            点赞
          </el-button>
          <span class="likes-count">点赞数: {{ likes }}</span>
        </div>
      </el-card>
      <div v-else class="no-data">
        <el-empty description="文章不存在或已被删除" />
      </div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "../axios";
import { useAuthStore } from '../store/auth';
import { ElMessage } from 'element-plus';
import { Star } from '@element-plus/icons-vue';
import type { Article, Like } from "../types/Article";

const article = ref<Article | null>(null);
const route = useRoute();
const router = useRouter();
const likes = ref<number>(0);
const loading = ref(true);
const liking = ref(false);
const authStore = useAuthStore();

const { id } = route.params;

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('zh-CN');
};

const fetchArticle = async () => {
  if (!authStore.isAuthenticated) {
    ElMessage.error('请先登录后再查看文章');
    router.push('/login');
    return;
  }

  const articleId = route.params.id;
  if (!articleId) {
    ElMessage.error('文章ID无效');
    router.push('/news');
    return;
  }

  loading.value = true;
  try {
    const response = await axios.get<Article>(`/articles/${articleId}`);
    article.value = response.data;
    await fetchLike();
  } catch (error: any) {
    console.error("Failed to load article:", error);
    if (error.response?.status === 401) {
      ElMessage.error('请先登录');
      router.push('/login');
    } else if (error.response?.status === 404) {
      ElMessage.error('文章不存在');
    } else {
      ElMessage.error('加载文章失败');
    }
  } finally {
    loading.value = false;
  }
};

const likeArticle = async () => {
  if (!authStore.isAuthenticated) {
    ElMessage.error('请先登录后再点赞');
    return;
  }

  const articleId = route.params.id;
  if (!articleId) {
    ElMessage.error('文章ID无效');
    return;
  }

  liking.value = true;
  try {
    const res = await axios.post<Like>(`/articles/${articleId}/like`);
    likes.value = res.data.likes;
    ElMessage.success('点赞成功');
  } catch (error: any) {
    console.log('Error Liking article:', error);
    if (error.response?.status === 401) {
      ElMessage.error('请先登录');
    } else {
      ElMessage.error('点赞失败，请稍后重试');
    }
  } finally {
    liking.value = false;
  }
};

const fetchLike = async () => {
  const articleId = route.params.id;
  if (!articleId) return;
  
  try {
    const res = await axios.get<Like>(`/articles/${articleId}/like`);
    likes.value = res.data.likes;
  } catch (error) {
    console.log('Error fetching likes:', error);
    // 点赞数获取失败不影响文章显示
  }
};

onMounted(() => {
  if (authStore.isAuthenticated) {
    fetchArticle();
  } else {
    ElMessage.error('请先登录后再查看文章');
    router.push('/login');
  }
});
</script>

<style scoped>
.article-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.article-title {
  font-size: 2.5em;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  color: #666;
  font-size: 14px;
}

.article-content {
  line-height: 1.8;
  font-size: 16px;
  color: #333;
  margin-bottom: 30px;
}

.article-content p {
  margin-bottom: 20px;
}

.article-actions {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.likes-count {
  font-size: 16px;
  color: #666;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.no-data {
  text-align: center;
  padding: 60px 20px;
}
</style>
