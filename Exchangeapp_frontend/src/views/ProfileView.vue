<template>
  <el-container class="profile-container">
    <el-main>
      <div class="profile-header">
        <h1>个人中心</h1>
      </div>

      <!-- 用户信息卡片 -->
      <el-card class="profile-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span>基本信息</span>
            <el-button type="primary" @click="editMode = !editMode">
              {{ editMode ? '取消编辑' : '编辑资料' }}
            </el-button>
          </div>
        </template>
        
        <div v-if="!editMode" class="profile-display">
          <div class="info-item">
            <label>用户名:</label>
            <span>{{ userProfile?.username || '未设置' }}</span>
          </div>
          <div class="info-item">
            <label>角色:</label>
            <el-tag :type="userProfile?.role === 'admin' ? 'danger' : 'primary'">
              {{ userProfile?.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </div>
          <div class="info-item">
            <label>个人签名:</label>
            <span>{{ userProfile?.signature || '这个人很懒，什么都没留下' }}</span>
          </div>
          <div class="info-item">
            <label>个人介绍:</label>
            <span>{{ userProfile?.introduction || '这个人很懒，什么都没留下' }}</span>
          </div>
        </div>

        <div v-else class="profile-edit">
          <el-form :model="editForm" label-width="100px">
            <el-form-item label="个人签名">
              <el-input 
                v-model="editForm.signature" 
                placeholder="请输入个人签名"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="个人介绍">
              <el-input 
                v-model="editForm.introduction" 
                type="textarea"
                :rows="4"
                placeholder="请输入个人介绍"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateProfile">保存</el-button>
              <el-button @click="editMode = false">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>

      <!-- 我的文章 -->
      <el-card class="articles-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span>我的文章</span>
            <div>
              <el-button type="primary" @click="createArticleVisible = true">
                发表文章
              </el-button>
            </div>
          </div>
        </template>
        
        <div v-if="userProfile?.articles?.items?.length" class="articles-list">
          <div v-for="article in userProfile.articles.items" :key="article.title" class="article-item">
            <div class="article-info">
              <h3>{{ article.title }}</h3>
              <p class="article-preview">{{ article.preview }}</p>
            </div>
            <div class="article-actions">
              <el-button size="small" type="primary" @click="viewArticle(article)">
                查看
              </el-button>
              <el-button size="small" type="warning" @click="editArticle(article)">
                编辑
              </el-button>
              <el-button size="small" type="danger" @click="deleteArticle(article)">
                删除
              </el-button>
            </div>
          </div>
          
          <!-- 分页 -->
          <el-pagination
            v-if="userProfile.articles.total_articles > userProfile.articles.page_size"
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="userProfile.articles.total_articles"
            layout="prev, pager, next"
            @current-change="handlePageChange"
            class="pagination"
          />
        </div>
        
        <div v-else class="no-articles">
          <el-empty description="您还没有发表过文章">
            <el-button type="primary" @click="createArticleVisible = true">
              发表第一篇文章
            </el-button>
          </el-empty>
        </div>
      </el-card>

      <!-- 发表文章对话框 -->
      <el-dialog 
        v-model="createArticleVisible" 
        :title="isEditingArticle ? '编辑文章' : '发表文章'" 
        width="70%" 
        :close-on-click-modal="false"
        @close="resetArticleForm"
      >
        <el-form :model="articleForm" label-width="80px">
          <el-form-item label="标题" required>
            <el-input v-model="articleForm.title" placeholder="请输入文章标题" maxlength="100" show-word-limit />
          </el-form-item>
          <el-form-item label="预览" required>
            <el-input 
              v-model="articleForm.preview" 
              type="textarea"
              :rows="3"
              placeholder="请输入文章预览（简短描述）"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="内容" required>
            <el-input 
              v-model="articleForm.content" 
              type="textarea"
              :rows="10"
              placeholder="请输入文章内容"
              maxlength="5000"
              show-word-limit
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="createArticleVisible = false">取消</el-button>
          <el-button type="primary" @click="submitArticle">
            {{ isEditingArticle ? '更新' : '发表' }}
          </el-button>
        </template>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useAuthStore } from '../store/auth';
import axios from '../axios';
import type { HomePageALLDTO, UpdateProfileInput } from '../types/User';
import type { ArticleInput, ArticleDTO } from '../types/Article';

const router = useRouter();
const authStore = useAuthStore();
const userProfile = ref<HomePageALLDTO | null>(null);
const editMode = ref(false);
const createArticleVisible = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const isEditingArticle = ref(false);
const editingArticleId = ref<number | null>(null);

const editForm = ref<UpdateProfileInput>({
  signature: '',
  introduction: ''
});

const articleForm = ref<ArticleInput>({
  title: '',
  content: '',
  preview: ''
});

// 获取用户资料
const fetchUserProfile = async (page = 1) => {
  try {
    if (!authStore.userInfo?.username) {
      ElMessage.error('用户信息不存在，请重新登录');
      router.push({ name: 'Login' });
      return;
    }
    
    const response = await axios.get<HomePageALLDTO>(`/users/${authStore.userInfo.username}`, {
      params: {
        page,
        page_size: pageSize.value
      }
    });
    userProfile.value = response.data;
    
    // 设置编辑表单的初始值
    editForm.value = {
      signature: response.data.signature || '',
      introduction: response.data.introduction || ''
    };
  } catch (error) {
    console.error('Failed to load user profile:', error);
    ElMessage.error('加载用户信息失败');
  }
};

// 更新用户资料
const updateProfile = async () => {
  try {
    if (!authStore.userInfo?.username) {
      ElMessage.error('用户信息不存在');
      return;
    }
    
    await axios.put(`/users/${authStore.userInfo.username}`, editForm.value);
    editMode.value = false;
    await fetchUserProfile(currentPage.value);
    ElMessage.success('资料更新成功！');
  } catch (error) {
    console.error('Failed to update profile:', error);
    ElMessage.error('资料更新失败');
  }
};

// 发表/更新文章
const submitArticle = async () => {
  try {
    if (isEditingArticle.value && editingArticleId.value) {
      // 更新文章
      await axios.put(`/articles/${editingArticleId.value}`, articleForm.value);
      ElMessage.success('文章更新成功！');
    } else {
      // 创建新文章
      await axios.post('/articles', articleForm.value);
      ElMessage.success('文章发表成功！');
    }
    
    createArticleVisible.value = false;
    resetArticleForm();
    await fetchUserProfile(currentPage.value);
  } catch (error) {
    console.error('Failed to submit article:', error);
    ElMessage.error(isEditingArticle.value ? '文章更新失败' : '文章发表失败');
  }
};

// 重置文章表单
const resetArticleForm = () => {
  articleForm.value = {
    title: '',
    content: '',
    preview: ''
  };
  isEditingArticle.value = false;
  editingArticleId.value = null;
};

// 查看文章
const viewArticle = (article: ArticleDTO) => {
  // 这里需要根据实际的文章ID来跳转
  // 暂时使用标题作为标识
  router.push({ name: 'NewsDetail', params: { id: article.title } });
};

// 编辑文章
const editArticle = (article: ArticleDTO) => {
  articleForm.value = {
    title: article.title,
    content: article.content,
    preview: article.preview
  };
  isEditingArticle.value = true;
  editingArticleId.value = article.id || null;
  createArticleVisible.value = true;
};

// 删除文章
const deleteArticle = async (article: ArticleDTO) => {
  if (!article.id) {
    ElMessage.error('无法删除：文章ID不存在');
    return;
  }
  
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    
    await axios.delete(`/articles/${article.id}`);
    await fetchUserProfile(currentPage.value);
    ElMessage.success('文章删除成功！');
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to delete article:', error);
      ElMessage.error('文章删除失败');
    }
  }
};

// 分页处理
const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchUserProfile(page);
};

onMounted(() => {
  fetchUserProfile();
});
</script>

<style scoped>
.profile-container {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.profile-header {
  margin-bottom: 20px;
}

.profile-header h1 {
  margin: 0;
  color: #333;
}

.profile-card, .articles-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-display {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-item label {
  font-weight: bold;
  min-width: 80px;
  color: #555;
}

.profile-edit {
  max-width: 600px;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.article-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  transition: box-shadow 0.3s;
}

.article-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.article-info {
  flex: 1;
}

.article-info h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 16px;
}

.article-preview {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.article-actions {
  display: flex;
  gap: 8px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.no-articles {
  padding: 40px;
  text-align: center;
}

@media (max-width: 768px) {
  .article-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .article-actions {
    align-self: flex-end;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
