<template>
  <el-dialog
    :title="isEdit ? '编辑汇率' : '创建汇率'"
    v-model="dialogVisible"
    width="50%"
    :before-close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="从货币" prop="fromCurrency">
        <el-input v-model="form.fromCurrency" placeholder="如: USD" />
      </el-form-item>
      
      <el-form-item label="到货币" prop="toCurrency">
        <el-input v-model="form.toCurrency" placeholder="如: EUR" />
      </el-form-item>
      
      <el-form-item label="汇率" prop="rate">
        <el-input-number 
          v-model="form.rate" 
          :precision="6" 
          :step="0.000001"
          :min="0"
          placeholder="输入汇率"
        />
      </el-form-item>
      
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="汇率描述（可选）"
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
import { Edit, Plus } from '@element-plus/icons-vue';

interface ExchangeRateForm {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  description: string;
}

interface Props {
  visible: boolean;
  exchangeRate?: any; // 编辑时的汇率数据
}

const props = defineProps<Props>();
const emit = defineEmits(['update:visible', 'success']);

const dialogVisible = ref(false);
const loading = ref(false);
const formRef = ref<FormInstance>();

const form = reactive<ExchangeRateForm>({
  fromCurrency: '',
  toCurrency: '',
  rate: 1,
  description: ''
});

const rules: FormRules = {
  fromCurrency: [
    { required: true, message: '请输入源货币代码', trigger: 'blur' },
    { min: 3, max: 3, message: '货币代码必须是3个字符', trigger: 'blur' }
  ],
  toCurrency: [
    { required: true, message: '请输入目标货币代码', trigger: 'blur' },
    { min: 3, max: 3, message: '货币代码必须是3个字符', trigger: 'blur' }
  ],
  rate: [
    { required: true, message: '请输入汇率', trigger: 'blur' },
    { type: 'number', min: 0, message: '汇率必须大于0', trigger: 'blur' }
  ]
};

const isEdit = computed(() => !!props.exchangeRate);

// 监听visible变化
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal;
  if (newVal && props.exchangeRate) {
    // 编辑模式，填充表单
    form.fromCurrency = props.exchangeRate.fromCurrency;
    form.toCurrency = props.exchangeRate.toCurrency;
    form.rate = props.exchangeRate.rate;
    form.description = props.exchangeRate.description || '';
  } else if (newVal) {
    // 创建模式，清空表单
    form.fromCurrency = '';
    form.toCurrency = '';
    form.rate = 1;
    form.description = '';
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
      // 更新汇率
      await axios.put(`/exchangeRates/${props.exchangeRate.id}`, form);
      ElMessage.success('汇率更新成功！');
    } else {
      // 创建汇率
      await axios.post('/exchangeRates', form);
      ElMessage.success('汇率创建成功！');
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
