<template>
  <el-container>
    <el-main>
      <!-- 顶部操作栏 -->
      <div class="top-actions">
        <h2 class="page-title">财经资讯</h2>
        <div class="action-buttons">
          <el-button type="primary" @click="showCreateForm = true" v-if="authStore.isAuthenticated">
            <el-icon><Plus /></el-icon>
            创建文章
          </el-button>
        </div>
      </div>

      <div v-if="articles && articles.length" class="articles-container">
        <el-card v-for="article in articles" :key="article.id" class="article-card">
          <div class="article-header">
            <h2>{{ article.title }}</h2>
            <div class="article-actions" v-if="authStore.isAuthenticated && (authStore.username === article.author || authStore.role === 'admin')">
              <el-button text size="small" @click="editArticle(article)">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button text size="small" type="danger" @click="deleteArticle(article.id)">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
          </div>
          <p class="article-preview">{{ article.preview }}</p>
          <div class="article-meta">
            <span class="author">作者: {{ article.author }}</span>
            <span class="date">{{ formatDate(article.created_at) }}</span>
            <el-button text @click="viewDetail(article.id)">阅读更多</el-button>
          </div>
        </el-card>
        
        <!-- 分页控件 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="totalArticles"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      <div v-else-if="loading" class="loading">
        <el-loading-component />
      </div>
      <div v-else class="no-data">
        <el-empty description="暂无文章" />
      </div>
    </el-main>

    <!-- 文章表单对话框 -->
    <ArticleForm
      v-model:visible="showCreateForm"
      :article="editingArticle"
      @success="handleArticleSuccess"
    />
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Edit, Delete } from '@element-plus/icons-vue';
import axios from '../axios';
import { useAuthStore } from '../store/auth';
import ArticleForm from '../components/ArticleForm.vue';
import type { Article, ArticlePage } from "../types/Article";

const articles = ref<Article[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const totalArticles = ref(0);
const loading = ref(false);
const showCreateForm = ref(false);
const editingArticle = ref<Article | null>(null);
const router = useRouter();
const authStore = useAuthStore();

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('zh-CN');
};

const fetchArticles = async () => {
  if (!authStore.isAuthenticated) {
    ElMessage.warning('请先登录后再查看文章');
    return;
  }
  
  loading.value = true;
  try {
    const response = await axios.get<ArticlePage>('/articles', {
      params: {
        page: currentPage.value,
        page_size: pageSize.value
      }
    });
    
    const data = response.data;
    articles.value = data.items;
    totalArticles.value = data.total_articles;
    currentPage.value = data.page;
    pageSize.value = data.page_size;
  } catch (error: any) {
    console.error('Failed to load articles:', error);
    if (error.response?.status === 401) {
      ElMessage.error('请先登录');
      router.push('/login');
    } else {
      ElMessage.error('加载文章失败');
    }
  } finally {
    loading.value = false;
  }
};

const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize;
  currentPage.value = 1;
  fetchArticles();
};

const handleCurrentChange = (newPage: number) => {
  currentPage.value = newPage;
  fetchArticles();
};

const viewDetail = (id: number) => {
  if (!authStore.isAuthenticated) {
    ElMessage.error('请先登录后再查看');
    return;
  }
  router.push({ name: 'NewsDetail', params: { id: id.toString() } });
};

const editArticle = (article: Article) => {
  editingArticle.value = article;
  showCreateForm.value = true;
};

const deleteArticle = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    
    console.log('正在删除文章，ID:', id);
    const response = await axios.delete(`/articles/${id}`);
    console.log('删除文章响应:', response);
    
    ElMessage.success('文章删除成功');
    fetchArticles();
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除文章失败:', error);
      console.error('错误详情:', error.response?.data);
      ElMessage.error(error.response?.data?.error || '删除文章失败');
    }
  }
};

const handleArticleSuccess = () => {
  fetchArticles();
  editingArticle.value = null;
};

onMounted(() => {
  if (authStore.isAuthenticated) {
    fetchArticles();
  }
});

// 监听认证状态变化
watch(() => authStore.isAuthenticated, (newValue) => {
  if (newValue) {
    fetchArticles();
  } else {
    articles.value = [];
    totalArticles.value = 0;
  }
});
</script>

<style scoped>
.top-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.page-title {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.articles-container {
  max-width: 1200px;
  margin: 0 auto;
}

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
  align-items: flex-start;
  margin-bottom: 10px;
}

.article-header h2 {
  margin: 0;
  flex: 1;
}

.article-actions {
  display: flex;
  gap: 5px;
}

.article-preview {
  color: #666;
  margin: 10px 0;
  line-height: 1.6;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.author {
  color: #999;
  font-size: 14px;
}

.date {
  color: #999;
  font-size: 14px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.no-data {
  text-align: center;
  padding: 60px 20px;
}
</style>
