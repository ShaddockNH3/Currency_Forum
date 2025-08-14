<template>
  <el-container>
    <el-main>
      <el-card v-if="article" class="article-detail">
        <div class="article-header">
          <h1>{{ article.title }}</h1>
          <div class="article-meta">
            <span class="author">作者: {{ article.author }}</span>
            <span class="date">发布时间: {{ formatDate(article.created_at) }}</span>
          </div>
        </div>
        <div class="article-content">
          <p>{{ article.content }}</p>
        </div>
        <div class="article-actions">
          <el-button type="primary" @click="likeArticle" :icon="Star">
            点赞 ({{ likes }})
          </el-button>
          <el-button 
            v-if="canDeleteArticle()" 
            type="danger" 
            @click="deleteArticle"
          >
            删除文章
          </el-button>
        </div>
        
        <!-- 评论区域 -->
        <el-divider>评论区</el-divider>
        <div class="comment-section">
          <el-form @submit.prevent="submitComment" class="comment-form">
            <el-input
              v-model="newComment"
              type="textarea"
              :rows="4"
              placeholder="写下您的评论..."
              maxlength="1000"
              show-word-limit
            />
            <el-button type="primary" @click="submitComment" :disabled="!newComment.trim()">
              发表评论
            </el-button>
          </el-form>
          
          <div class="comments-list">
            <div v-for="comment in comments" :key="comment.id" class="comment-item">
              <div class="comment-header">
                <span class="comment-author">{{ comment.username }}</span>
                <span class="comment-date">{{ formatDate(comment.created_at) }}</span>
                <div class="comment-actions">
                  <el-button size="small" type="text" @click="startReply(comment)">
                    回复
                  </el-button>
                  <el-button 
                    v-if="canDeleteComment(comment)" 
                    size="small" 
                    type="text" 
                    class="delete-btn"
                    @click="deleteComment(comment.id)"
                  >
                    删除
                  </el-button>
                </div>
              </div>
              <div class="comment-content">{{ comment.content }}</div>
              
              <!-- 回复输入框 -->
              <div v-if="replyingTo === comment.id" class="reply-form">
                <el-input
                  v-model="replyContent"
                  type="textarea"
                  :rows="2"
                  placeholder="写下您的回复..."
                  maxlength="500"
                  show-word-limit
                />
                <div class="reply-actions">
                  <el-button size="small" @click="cancelReply">取消</el-button>
                  <el-button size="small" type="primary" @click="submitReply(comment.id)">
                    发表回复
                  </el-button>
                </div>
              </div>
              
              <!-- 子评论/回复 -->
              <div v-if="comment.replies && comment.replies.length" class="replies">
                <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                  <div class="reply-header">
                    <span class="reply-author">{{ reply.username }}</span>
                    <span class="reply-date">{{ formatDate(reply.created_at) }}</span>
                    <el-button 
                      v-if="canDeleteComment(reply)" 
                      size="small" 
                      type="text" 
                      class="delete-btn"
                      @click="deleteComment(reply.id)"
                    >
                      删除
                    </el-button>
                  </div>
                  <div class="reply-content">{{ reply.content }}</div>
                </div>
              </div>
            </div>
            <div v-if="!comments.length" class="no-comments">
              暂无评论，来发表第一条评论吧！
            </div>
          </div>
        </div>
      </el-card>
      <div v-else class="no-data">您必须登录/注册才可以阅读文章</div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from 'element-plus';
import { Star } from '@element-plus/icons-vue';
import { useAuthStore } from '../store/auth';
import axios from "../axios";
import type { ArticleDTO, Like, CommentDTO, CommentInput, CommentListDTO } from "../types/Article";

const article = ref<ArticleDTO | null>(null);
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const likes = ref<number>(0);
const comments = ref<CommentDTO[]>([]);
const newComment = ref<string>('');

// 回复相关
const replyingTo = ref<number | null>(null);
const replyContent = ref<string>('');

const { id } = route.params;

const fetchArticle = async () => {
  try {
    const response = await axios.get<ArticleDTO>(`/articles/${id}`);
    article.value = response.data;
  } catch (error) {
    console.error("Failed to load article:", error);
  }
};

const likeArticle = async () => {
  try {
    await axios.post<Like>(`/articles/${id}/like`);
    await fetchLike(); // 重新获取点赞数
    ElMessage.success('点赞成功！');
  } catch (error) {
    console.log('Error Liking article:', error);
    ElMessage.error('点赞失败');
  }
};

const fetchLike = async () => {
  try {
    const res = await axios.get<Like>(`/articles/${id}/like`)
    likes.value = res.data.likes
  } catch (error) {
    console.log('Error fetching likes:', error)
  }
};

const fetchComments = async () => {
  try {
    const response = await axios.get<CommentListDTO>(`/articles/${id}/comments`);
    const commentsData = response.data?.comments || [];
    
    // 处理评论层级结构
    const topLevelComments = commentsData.filter(comment => !comment.parent_id);
    const repliesMap = new Map<number, CommentDTO[]>();
    
    // 将回复按parent_id分组
    commentsData.filter(comment => comment.parent_id).forEach(reply => {
      if (!repliesMap.has(reply.parent_id!)) {
        repliesMap.set(reply.parent_id!, []);
      }
      repliesMap.get(reply.parent_id!)!.push(reply);
    });
    
    // 为顶级评论添加回复
    topLevelComments.forEach(comment => {
      comment.replies = repliesMap.get(comment.id) || [];
    });
    
    comments.value = topLevelComments;
  } catch (error) {
    console.error('Failed to load comments:', error);
  }
};

const submitComment = async () => {
  if (!newComment.value.trim()) return;
  
  try {
    const commentInput: CommentInput = {
      article_id: parseInt(id as string),
      content: newComment.value,
    };
    await axios.post('/comments', commentInput);
    newComment.value = '';
    await fetchComments();
    ElMessage.success('评论发表成功！');
  } catch (error) {
    console.error('Failed to submit comment:', error);
    ElMessage.error('评论发表失败');
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN');
};

// 回复相关方法
const startReply = (comment: CommentDTO) => {
  replyingTo.value = comment.id;
  replyContent.value = '';
};

const cancelReply = () => {
  replyingTo.value = null;
  replyContent.value = '';
};

const submitReply = async (parentId: number) => {
  if (!replyContent.value.trim()) return;
  
  try {
    const replyInput: CommentInput = {
      article_id: parseInt(id as string),
      parent_id: parentId,
      content: replyContent.value,
    };
    await axios.post('/comments', replyInput);
    replyContent.value = '';
    replyingTo.value = null;
    await fetchComments();
    ElMessage.success('回复发表成功！');
  } catch (error) {
    console.error('Failed to submit reply:', error);
    ElMessage.error('回复发表失败');
  }
};

// 权限检查
const canDeleteComment = (comment: CommentDTO) => {
  return authStore.userInfo?.role === 'admin' || 
         authStore.userInfo?.username === comment.username;
};

// 权限检查 - 只有管理员或文章作者可以删除文章
const canDeleteArticle = () => {
  return article.value && (
    authStore.userInfo?.role === 'admin' || 
    authStore.userInfo?.username === article.value.author
  );
};

// 删除文章
const deleteArticle = async () => {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？删除后将无法恢复！', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    
    await axios.delete(`/articles/${id}`);
    ElMessage.success('文章删除成功！');
    router.push({ name: 'News' }); // 删除成功后跳转到文章列表
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to delete article:', error);
      ElMessage.error('文章删除失败');
    }
  }
};

// 删除评论
const deleteComment = async (commentId: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这条评论吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    
    await axios.delete(`/comments/${commentId}`);
    await fetchComments();
    ElMessage.success('评论删除成功！');
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to delete comment:', error);
      ElMessage.error('评论删除失败');
    }
  }
};

onMounted(() => {
  fetchArticle();
  fetchLike();
  fetchComments();
});
</script>

<style scoped>
.article-detail {
  margin: 20px 0;
  max-width: 800px;
  margin: 20px auto;
}

.article-header h1 {
  color: #333;
  margin-bottom: 10px;
}

.article-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.author, .date {
  color: #666;
  font-size: 0.9em;
}

.article-content {
  line-height: 1.8;
  font-size: 16px;
  color: #333;
  margin: 30px 0;
}

.article-actions {
  margin: 20px 0;
  display: flex;
  gap: 10px;
}

.comment-section {
  margin-top: 30px;
}

.comment-form {
  margin-bottom: 30px;
}

.comment-form .el-input {
  margin-bottom: 15px;
}

.comments-list {
  max-height: 500px;
  overflow-y: auto;
}

.comment-item {
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 15px;
  background-color: #fafafa;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.comment-author {
  font-weight: bold;
  color: #409eff;
}

.comment-date {
  color: #999;
  font-size: 0.85em;
}

.comment-actions {
  display: flex;
  gap: 10px;
}

.delete-btn {
  color: #f56c6c !important;
}

.comment-content {
  color: #333;
  line-height: 1.6;
  margin-bottom: 10px;
}

.reply-form {
  margin-top: 15px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.reply-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  justify-content: flex-end;
}

.replies {
  margin-top: 15px;
  margin-left: 20px;
  border-left: 2px solid #e4e7ed;
  padding-left: 20px;
}

.reply-item {
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 10px;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.reply-author {
  font-weight: bold;
  color: #67c23a;
  font-size: 0.9em;
}

.reply-date {
  color: #999;
  font-size: 0.8em;
}

.reply-content {
  color: #333;
  line-height: 1.5;
  font-size: 0.9em;
}

.no-comments {
  text-align: center;
  color: #999;
  padding: 40px;
  font-style: italic;
}

.no-data {
  text-align: center;
  font-size: 1.2em;
  color: #999;
  padding: 40px;
}
</style>
