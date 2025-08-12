<template>
  <el-dialog
    :title="isEdit ? '编辑文章' : '创建文章'"
    v-model="dialogVisible"
    width="60%"
    :before-close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入文章标题" />
      </el-form-item>
      
      <el-form-item label="预览" prop="preview">
        <el-input
          v-model="form.preview"
          type="textarea"
          :rows="3"
          placeholder="请输入文章预览内容"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      
      <el-form-item label="内容" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="8"
          placeholder="请输入文章内容"
        />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          {{ isEdit ? '更新' : '创建' }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import axios from '../axios';
import { useAuthStore } from '../store/auth';

interface ArticleForm {
  title: string;
  preview: string;
  content: string;
}

interface Props {
  visible: boolean;
  article?: any; // 编辑时的文章数据
}

const props = defineProps<Props>();
const emit = defineEmits(['update:visible', 'success']);

const dialogVisible = ref(false);
const loading = ref(false);
const formRef = ref<FormInstance>();
const authStore = useAuthStore();

const form = reactive<ArticleForm>({
  title: '',
  preview: '',
  content: ''
});

const rules: FormRules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 1, max: 100, message: '标题长度在 1 到 100 个字符', trigger: 'blur' }
  ],
  preview: [
    { required: true, message: '请输入文章预览', trigger: 'blur' },
    { min: 10, max: 200, message: '预览长度在 10 到 200 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
    { min: 20, message: '文章内容不能少于 20 个字符', trigger: 'blur' }
  ]
};

const isEdit = computed(() => !!props.article);

// 监听visible变化
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal;
  if (newVal && props.article) {
    // 编辑模式，填充表单
    form.title = props.article.title;
    form.preview = props.article.preview;
    form.content = props.article.content;
  } else if (newVal) {
    // 创建模式，清空表单
    form.title = '';
    form.preview = '';
    form.content = '';
  }
});

// 监听dialogVisible变化
watch(dialogVisible, (newVal) => {
  emit('update:visible', newVal);
});

const handleClose = () => {
  dialogVisible.value = false;
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  
  try {
    const valid = await formRef.value.validate();
    if (!valid) return;
    
    loading.value = true;
    
    if (isEdit.value) {
      // 更新文章
      await axios.put(`/articles/${props.article.id}`, form);
      ElMessage.success('文章更新成功！');
    } else {
      // 创建文章
      await axios.post('/articles', form);
      ElMessage.success('文章创建成功！');
    }
    
    emit('success');
    handleClose();
    
  } catch (error: any) {
    console.error('操作失败:', error);
    ElMessage.error(error.response?.data?.error || '操作失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
