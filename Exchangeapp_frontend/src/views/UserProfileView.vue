<template>
  <el-container class="user-profile-container">
    <el-main>
      <div v-if="loading" class="loading">
        <el-loading-component />
      </div>
      
      <div v-else-if="userData" class="profile-content">
        <!-- 用户信息卡片 -->
        <el-card class="profile-card">
          <div class="profile-header">
            <el-avatar :size="80" icon="UserFilled" />
            <div class="profile-info">
              <h1>{{ userData.username }}</h1>
              <p class="role">{{ userData.role === 'admin' ? '管理员' : '普通用户' }}</p>
              <p class="signature" v-if="userData.signature">{{ userData.signature }}</p>
              <p class="introduction" v-if="userData.introduction">{{ userData.introduction }}</p>
            </div>
          </div>
        </el-card>

        <!-- 文章列表 -->
        <el-card class="articles-card">
          <template #header>
            <div class="card-header">
              <span>文章列表 (共 {{ userData.articles.total_articles }} 篇)</span>
            </div>
          </template>
          
          <div v-if="userData.articles.items && userData.articles.items.length" class="articles-list">
            <div v-for="article in userData.articles.items" :key="article.id" class="article-item">
              <div class="article-header">
                <h3 class="article-title">{{ article.title }}</h3>
                <div class="article-actions" v-if="authStore.isAuthenticated && (authStore.username === userData.username || authStore.role === 'admin')">
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
                <span class="article-date">{{ formatDate(article.created_at) }}</span>
                <el-button text @click="viewArticle(article.id)">阅读全文</el-button>
              </div>
            </div>
          </div>
          
          <div v-else class="no-articles">
            <el-empty description="暂无文章" />
          </div>
          
          <!-- 分页控件 -->
          <div v-if="userData.articles.total_articles > 0" class="pagination-container">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="userData.articles.total_articles"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-card>
      </div>
      
      <div v-else class="error-content">
        <el-empty description="用户不存在或加载失败" />
      </div>
    </el-main>

    <!-- 文章表单对话框 -->
    <ArticleForm
      v-model:visible="showArticleForm"
      :article="editingArticle"
      @success="handleArticleSuccess"
    />
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Edit, Delete } from '@element-plus/icons-vue';
import axios from '../axios';
import { useAuthStore } from '../store/auth';
import ArticleForm from '../components/ArticleForm.vue';
import type { HomePageData } from '../types/Article';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const userData = ref<HomePageData | null>(null);
const loading = ref(true);
const currentPage = ref(1);
const pageSize = ref(10);
const showArticleForm = ref(false);
const editingArticle = ref<any>(null);

const username = computed(() => route.params.username as string);

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('zh-CN');
};

const fetchUserProfile = async () => {
  if (!authStore.isAuthenticated) {
    ElMessage.error('请先登录');
    router.push('/login');
    return;
  }

  loading.value = true;
  try {
    const response = await axios.get<HomePageData>(`/users/${username.value}`, {
      params: {
        page: currentPage.value,
        page_size: pageSize.value
      }
    });
    
    userData.value = response.data;
    currentPage.value = response.data.articles.page;
    pageSize.value = response.data.articles.page_size;
  } catch (error: any) {
    console.error('Failed to load user profile:', error);
    if (error.response?.status === 401) {
      ElMessage.error('请先登录');
      router.push('/login');
    } else if (error.response?.status === 404) {
      ElMessage.error('用户不存在');
    } else {
      ElMessage.error('加载用户资料失败');
    }
  } finally {
    loading.value = false;
  }
};

const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize;
  currentPage.value = 1;
  fetchUserProfile();
};

const handleCurrentChange = (newPage: number) => {
  currentPage.value = newPage;
  fetchUserProfile();
};

const viewArticle = (articleId: number) => {
  router.push({ name: 'NewsDetail', params: { id: articleId.toString() } });
};

const editArticle = (article: any) => {
  editingArticle.value = article;
  showArticleForm.value = true;
};

const deleteArticle = async (articleId: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    
    await axios.delete(`/articles/${articleId}`);
    ElMessage.success('文章删除成功');
    fetchUserProfile();
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除文章失败:', error);
      ElMessage.error('删除文章失败');
    }
  }
};

const handleArticleSuccess = () => {
  fetchUserProfile();
  editingArticle.value = null;
};

onMounted(() => {
  if (authStore.isAuthenticated) {
    fetchUserProfile();
  } else {
    ElMessage.error('请先登录');
    router.push('/login');
  }
});
</script>

<style scoped>
.user-profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-card {
  border: none;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.profile-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.profile-info h1 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 2em;
}

.role {
  color: #409eff;
  font-weight: 500;
  margin: 5px 0;
}

.signature {
  color: #666;
  font-style: italic;
  margin: 10px 0;
  font-size: 16px;
}

.introduction {
  color: #666;
  line-height: 1.6;
  margin: 10px 0;
}

.articles-card {
  border: none;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.card-header {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.article-item {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.article-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.article-title {
  margin: 0;
  color: #333;
  font-size: 18px;
  flex: 1;
}

.article-actions {
  display: flex;
  gap: 5px;
}

.article-preview {
  color: #666;
  line-height: 1.6;
  margin: 10px 0;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.article-date {
  color: #999;
  font-size: 14px;
}

.no-articles {
  padding: 40px 20px;
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
  height: 400px;
}

.error-content {
  padding: 60px 20px;
}

@media (max-width: 768px) {
  .user-profile-container {
    padding: 15px;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-info h1 {
    font-size: 1.5em;
  }
  
  .article-header {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
