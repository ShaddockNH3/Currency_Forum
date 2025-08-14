<template>
  <el-container>
    <el-main>
      <div v-if="articles && articles.length">
        <el-card v-for="article in articles" :key="article.id" class="article-card">
          <div class="article-header">
            <h2>{{ article.title }}</h2>
            <span class="author">作者: {{ article.author }}</span>
          </div>
          <p class="preview">{{ article.preview }}</p>
          <div class="article-footer">
            <span class="date">发布时间: {{ formatDate(article.created_at) }}</span>
            <div class="article-actions">
              <el-button type="primary" @click="viewDetail(article.id)">阅读更多</el-button>
              <el-button 
                v-if="canDeleteArticle(article)" 
                type="danger" 
                size="small"
                @click="deleteArticle(article.id)"
              >
                删除
              </el-button>
            </div>
          </div>
        </el-card>
        
        <!-- 分页组件 -->
        <el-pagination
          v-if="totalArticles > pageSize"
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="totalArticles"
          layout="prev, pager, next, total"
          @current-change="handlePageChange"
          class="pagination"
        />
      </div>
      <div v-else-if="!authStore.isAuthenticated" class="no-data">您必须登录/注册才可以查看文章</div>
      <div v-else class="no-data">暂无文章数据</div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import axios from '../axios';
import { useAuthStore } from '../store/auth';
import type { ArticleDTO } from "../types/Article";

const articles = ref<ArticleDTO[]>([]);
const router = useRouter();
const authStore = useAuthStore();

// 分页相关数据
const currentPage = ref(1);
const pageSize = ref(10);
const totalArticles = ref(0);

const fetchArticles = async (page = 1) => {
  // 只有在已登录状态下才获取文章
  if (!authStore.isAuthenticated) {
    console.log('用户未登录，跳过文章获取');
    articles.value = [];
    return;
  }

  try {
    console.log(`开始获取文章列表 - 第${page}页...`);
    console.log('当前认证状态:', authStore.isAuthenticated);
    console.log('当前token:', localStorage.getItem('token'));
    
    const response = await axios.get<any>('/articles', {
      params: {
        page: page,
        page_size: pageSize.value
      }
    });
    
    // 后端返回的是分页数据，需要取出items
    const articleData = response.data;
    console.log('原始响应数据:', articleData);
    
    if (articleData && articleData.items) {
      // 后端返回的是ArticlePageDTO格式
      articles.value = articleData.items;
      totalArticles.value = articleData.total_articles;
      currentPage.value = articleData.page;
      console.log(`文章获取成功: ${articleData.items.length}篇，总计${articleData.total_articles}篇`);
    } else if (Array.isArray(articleData)) {
      // 如果直接返回数组
      articles.value = articleData;
      totalArticles.value = articleData.length;
    } else {
      articles.value = [];
      totalArticles.value = 0;
    }
    console.log('处理后的文章数据:', articles.value);
  } catch (error: any) {
    console.error('Failed to load articles:', error);
    if (error.response?.status === 401) {
      ElMessage.error('登录已过期，请重新登录');
      authStore.logout();
      router.push({ name: 'Login' });
    } else {
      ElMessage.error('加载文章失败');
    }
  }
};

const viewDetail = (articleId: number) => {
  if (!authStore.isAuthenticated) {
    ElMessage.error('请先登录后再查看');
    return;
  }
  router.push({ name: 'NewsDetail', params: { id: articleId.toString() } });
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN');
};

// 分页处理
const handlePageChange = (page: number) => {
  console.log(`切换到第${page}页`);
  fetchArticles(page);
};

// 权限检查 - 只有管理员或文章作者可以删除文章
const canDeleteArticle = (article: ArticleDTO) => {
  return authStore.userInfo?.role === 'admin' || 
         authStore.userInfo?.username === article.author;
};

// 删除文章
const deleteArticle = async (articleId: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    
    await axios.delete(`/articles/${articleId}`);
    await fetchArticles(currentPage.value); // 重新获取当前页文章
    ElMessage.success('文章删除成功！');
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to delete article:', error);
      ElMessage.error('文章删除失败');
    }
  }
};

onMounted(fetchArticles);

// 监听认证状态变化，当用户登录后自动获取文章
watch(() => authStore.isAuthenticated, (newValue) => {
  if (newValue) {
    fetchArticles();
  } else {
    articles.value = [];
  }
});
</script>

<style scoped>
.article-card {
  margin: 20px 0;
  transition: box-shadow 0.3s ease;
}

.article-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.article-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5em;
}

.author {
  color: #666;
  font-size: 0.9em;
}

.preview {
  color: #555;
  line-height: 1.6;
  margin: 15px 0;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.article-actions {
  display: flex;
  gap: 10px;
}

.date {
  color: #999;
  font-size: 0.9em;
}

.no-data {
  text-align: center;
  font-size: 1.2em;
  color: #999;
  padding: 40px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 20px;
}
</style>
