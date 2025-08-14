/* __placeholder__ */
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useAuthStore } from '../store/auth';
import axios from '../axios';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const router = useRouter();
const authStore = useAuthStore();
const userProfile = ref(null);
const editMode = ref(false);
const createArticleVisible = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const isEditingArticle = ref(false);
const editingArticleId = ref(null);
const editForm = ref({
    signature: '',
    introduction: ''
});
const articleForm = ref({
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
        const response = await axios.get(`/users/${authStore.userInfo.username}`, {
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
    }
    catch (error) {
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
    }
    catch (error) {
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
        }
        else {
            // 创建新文章
            await axios.post('/articles', articleForm.value);
            ElMessage.success('文章发表成功！');
        }
        createArticleVisible.value = false;
        resetArticleForm();
        await fetchUserProfile(currentPage.value);
    }
    catch (error) {
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
const viewArticle = (article) => {
    // 这里需要根据实际的文章ID来跳转
    // 暂时使用标题作为标识
    router.push({ name: 'NewsDetail', params: { id: article.title } });
};
// 编辑文章
const editArticle = (article) => {
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
const deleteArticle = async (article) => {
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
    }
    catch (error) {
        if (error !== 'cancel') {
            console.error('Failed to delete article:', error);
            ElMessage.error('文章删除失败');
        }
    }
};
// 分页处理
const handlePageChange = (page) => {
    currentPage.value = page;
    fetchUserProfile(page);
};
onMounted(() => {
    fetchUserProfile();
});
const __VLS_fnComponent = (await import('vue')).defineComponent({});
let __VLS_functionalComponentProps;
let __VLS_modelEmitsType;
function __VLS_template() {
    let __VLS_ctx;
    /* Components */
    let __VLS_otherComponents;
    let __VLS_own;
    let __VLS_localComponents;
    let __VLS_components;
    let __VLS_styleScopedClasses;
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    const __VLS_0 = {}.ElContainer;
    ({}.ElContainer);
    ({}.ElContainer);
    __VLS_components.ElContainer;
    __VLS_components.elContainer;
    __VLS_components.ElContainer;
    __VLS_components.elContainer;
    // @ts-ignore
    [ElContainer, ElContainer,];
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ...{ class: ("profile-container") }, }));
    const __VLS_2 = __VLS_1({ ...{ class: ("profile-container") }, }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    ({}({ ...{ class: ("profile-container") }, }));
    const __VLS_6 = {}.ElMain;
    ({}.ElMain);
    ({}.ElMain);
    __VLS_components.ElMain;
    __VLS_components.elMain;
    __VLS_components.ElMain;
    __VLS_components.elMain;
    // @ts-ignore
    [ElMain, ElMain,];
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({}));
    const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
    ({}({}));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("profile-header") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
    const __VLS_12 = {}.ElCard;
    ({}.ElCard);
    ({}.ElCard);
    __VLS_components.ElCard;
    __VLS_components.elCard;
    __VLS_components.ElCard;
    __VLS_components.elCard;
    // @ts-ignore
    [ElCard, ElCard,];
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({ ...{ class: ("profile-card") }, shadow: ("hover"), }));
    const __VLS_14 = __VLS_13({ ...{ class: ("profile-card") }, shadow: ("hover"), }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    ({}({ ...{ class: ("profile-card") }, shadow: ("hover"), }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        (__VLS_17.slots).header;
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("card-header") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        const __VLS_18 = {}.ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({ ...{ 'onClick': {} }, type: ("primary"), }));
        const __VLS_20 = __VLS_19({ ...{ 'onClick': {} }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_19));
        ({}({ ...{ 'onClick': {} }, type: ("primary"), }));
        let __VLS_24;
        const __VLS_25 = {
            onClick: (...[$event]) => {
                __VLS_ctx.editMode = !__VLS_ctx.editMode;
                // @ts-ignore
                [editMode, editMode,];
            }
        };
        (__VLS_ctx.editMode ? '取消编辑' : '编辑资料');
        // @ts-ignore
        [editMode,];
        (__VLS_23.slots).default;
        const __VLS_23 = __VLS_pickFunctionalComponentCtx(__VLS_18, __VLS_20);
        let __VLS_21;
        let __VLS_22;
    }
    if (!__VLS_ctx.editMode) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("profile-display") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("info-item") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        // @ts-ignore
        [editMode,];
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.userProfile?.username || '未设置');
        // @ts-ignore
        [userProfile,];
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("info-item") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        const __VLS_26 = {}.ElTag;
        ({}.ElTag);
        ({}.ElTag);
        __VLS_components.ElTag;
        __VLS_components.elTag;
        __VLS_components.ElTag;
        __VLS_components.elTag;
        // @ts-ignore
        [ElTag, ElTag,];
        const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({ type: ((__VLS_ctx.userProfile?.role === 'admin' ? 'danger' : 'primary')), }));
        const __VLS_28 = __VLS_27({ type: ((__VLS_ctx.userProfile?.role === 'admin' ? 'danger' : 'primary')), }, ...__VLS_functionalComponentArgsRest(__VLS_27));
        ({}({ type: ((__VLS_ctx.userProfile?.role === 'admin' ? 'danger' : 'primary')), }));
        (__VLS_ctx.userProfile?.role === 'admin' ? '管理员' : '普通用户');
        // @ts-ignore
        [userProfile, userProfile,];
        (__VLS_31.slots).default;
        const __VLS_31 = __VLS_pickFunctionalComponentCtx(__VLS_26, __VLS_28);
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("info-item") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.userProfile?.signature || '这个人很懒，什么都没留下');
        // @ts-ignore
        [userProfile,];
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("info-item") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.userProfile?.introduction || '这个人很懒，什么都没留下');
        // @ts-ignore
        [userProfile,];
    }
    else {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("profile-edit") }, });
        const __VLS_32 = {}.ElForm;
        ({}.ElForm);
        ({}.ElForm);
        __VLS_components.ElForm;
        __VLS_components.elForm;
        __VLS_components.ElForm;
        __VLS_components.elForm;
        // @ts-ignore
        [ElForm, ElForm,];
        const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({ model: ((__VLS_ctx.editForm)), labelWidth: ("100px"), }));
        const __VLS_34 = __VLS_33({ model: ((__VLS_ctx.editForm)), labelWidth: ("100px"), }, ...__VLS_functionalComponentArgsRest(__VLS_33));
        ({}({ model: ((__VLS_ctx.editForm)), labelWidth: ("100px"), }));
        const __VLS_38 = {}.ElFormItem;
        ({}.ElFormItem);
        ({}.ElFormItem);
        __VLS_components.ElFormItem;
        __VLS_components.elFormItem;
        __VLS_components.ElFormItem;
        __VLS_components.elFormItem;
        // @ts-ignore
        [ElFormItem, ElFormItem,];
        const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({ label: ("个人签名"), }));
        const __VLS_40 = __VLS_39({ label: ("个人签名"), }, ...__VLS_functionalComponentArgsRest(__VLS_39));
        ({}({ label: ("个人签名"), }));
        const __VLS_44 = {}.ElInput;
        ({}.ElInput);
        __VLS_components.ElInput;
        __VLS_components.elInput;
        // @ts-ignore
        [ElInput,];
        const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({ modelValue: ((__VLS_ctx.editForm.signature)), placeholder: ("请输入个人签名"), maxlength: ("100"), showWordLimit: (true), }));
        const __VLS_46 = __VLS_45({ modelValue: ((__VLS_ctx.editForm.signature)), placeholder: ("请输入个人签名"), maxlength: ("100"), showWordLimit: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_45));
        ({}({ modelValue: ((__VLS_ctx.editForm.signature)), placeholder: ("请输入个人签名"), maxlength: ("100"), showWordLimit: (true), }));
        // @ts-ignore
        [editForm, editForm,];
        const __VLS_49 = __VLS_pickFunctionalComponentCtx(__VLS_44, __VLS_46);
        (__VLS_43.slots).default;
        const __VLS_43 = __VLS_pickFunctionalComponentCtx(__VLS_38, __VLS_40);
        const __VLS_50 = {}.ElFormItem;
        ({}.ElFormItem);
        ({}.ElFormItem);
        __VLS_components.ElFormItem;
        __VLS_components.elFormItem;
        __VLS_components.ElFormItem;
        __VLS_components.elFormItem;
        // @ts-ignore
        [ElFormItem, ElFormItem,];
        const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({ label: ("个人介绍"), }));
        const __VLS_52 = __VLS_51({ label: ("个人介绍"), }, ...__VLS_functionalComponentArgsRest(__VLS_51));
        ({}({ label: ("个人介绍"), }));
        const __VLS_56 = {}.ElInput;
        ({}.ElInput);
        __VLS_components.ElInput;
        __VLS_components.elInput;
        // @ts-ignore
        [ElInput,];
        const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({ modelValue: ((__VLS_ctx.editForm.introduction)), type: ("textarea"), rows: ((4)), placeholder: ("请输入个人介绍"), maxlength: ("500"), showWordLimit: (true), }));
        const __VLS_58 = __VLS_57({ modelValue: ((__VLS_ctx.editForm.introduction)), type: ("textarea"), rows: ((4)), placeholder: ("请输入个人介绍"), maxlength: ("500"), showWordLimit: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_57));
        ({}({ modelValue: ((__VLS_ctx.editForm.introduction)), type: ("textarea"), rows: ((4)), placeholder: ("请输入个人介绍"), maxlength: ("500"), showWordLimit: (true), }));
        // @ts-ignore
        [editForm,];
        const __VLS_61 = __VLS_pickFunctionalComponentCtx(__VLS_56, __VLS_58);
        (__VLS_55.slots).default;
        const __VLS_55 = __VLS_pickFunctionalComponentCtx(__VLS_50, __VLS_52);
        const __VLS_62 = {}.ElFormItem;
        ({}.ElFormItem);
        ({}.ElFormItem);
        __VLS_components.ElFormItem;
        __VLS_components.elFormItem;
        __VLS_components.ElFormItem;
        __VLS_components.elFormItem;
        // @ts-ignore
        [ElFormItem, ElFormItem,];
        const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({}));
        const __VLS_64 = __VLS_63({}, ...__VLS_functionalComponentArgsRest(__VLS_63));
        ({}({}));
        const __VLS_68 = {}.ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({ ...{ 'onClick': {} }, type: ("primary"), }));
        const __VLS_70 = __VLS_69({ ...{ 'onClick': {} }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_69));
        ({}({ ...{ 'onClick': {} }, type: ("primary"), }));
        let __VLS_74;
        const __VLS_75 = {
            onClick: (__VLS_ctx.updateProfile)
        };
        // @ts-ignore
        [updateProfile,];
        (__VLS_73.slots).default;
        const __VLS_73 = __VLS_pickFunctionalComponentCtx(__VLS_68, __VLS_70);
        let __VLS_71;
        let __VLS_72;
        const __VLS_76 = {}.ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({ ...{ 'onClick': {} }, }));
        const __VLS_78 = __VLS_77({ ...{ 'onClick': {} }, }, ...__VLS_functionalComponentArgsRest(__VLS_77));
        ({}({ ...{ 'onClick': {} }, }));
        let __VLS_82;
        const __VLS_83 = {
            onClick: (...[$event]) => {
                if (!(!((!__VLS_ctx.editMode))))
                    return;
                __VLS_ctx.editMode = false;
                // @ts-ignore
                [editMode,];
            }
        };
        (__VLS_81.slots).default;
        const __VLS_81 = __VLS_pickFunctionalComponentCtx(__VLS_76, __VLS_78);
        let __VLS_79;
        let __VLS_80;
        (__VLS_67.slots).default;
        const __VLS_67 = __VLS_pickFunctionalComponentCtx(__VLS_62, __VLS_64);
        (__VLS_37.slots).default;
        const __VLS_37 = __VLS_pickFunctionalComponentCtx(__VLS_32, __VLS_34);
    }
    const __VLS_17 = __VLS_pickFunctionalComponentCtx(__VLS_12, __VLS_14);
    const __VLS_84 = {}.ElCard;
    ({}.ElCard);
    ({}.ElCard);
    __VLS_components.ElCard;
    __VLS_components.elCard;
    __VLS_components.ElCard;
    __VLS_components.elCard;
    // @ts-ignore
    [ElCard, ElCard,];
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({ ...{ class: ("articles-card") }, shadow: ("hover"), }));
    const __VLS_86 = __VLS_85({ ...{ class: ("articles-card") }, shadow: ("hover"), }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    ({}({ ...{ class: ("articles-card") }, shadow: ("hover"), }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        (__VLS_89.slots).header;
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("card-header") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        const __VLS_90 = {}.ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({ ...{ 'onClick': {} }, type: ("primary"), }));
        const __VLS_92 = __VLS_91({ ...{ 'onClick': {} }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_91));
        ({}({ ...{ 'onClick': {} }, type: ("primary"), }));
        let __VLS_96;
        const __VLS_97 = {
            onClick: (...[$event]) => {
                __VLS_ctx.createArticleVisible = true;
                // @ts-ignore
                [createArticleVisible,];
            }
        };
        (__VLS_95.slots).default;
        const __VLS_95 = __VLS_pickFunctionalComponentCtx(__VLS_90, __VLS_92);
        let __VLS_93;
        let __VLS_94;
    }
    if (__VLS_ctx.userProfile?.articles?.items?.length) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("articles-list") }, });
        for (const [article] of __VLS_getVForSourceType((__VLS_ctx.userProfile.articles.items))) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ key: ((article.title)), ...{ class: ("article-item") }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("article-info") }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
            (article.title);
            // @ts-ignore
            [userProfile, userProfile,];
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("article-preview") }, });
            (article.preview);
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("article-actions") }, });
            const __VLS_98 = {}.ElButton;
            ({}.ElButton);
            ({}.ElButton);
            __VLS_components.ElButton;
            __VLS_components.elButton;
            __VLS_components.ElButton;
            __VLS_components.elButton;
            // @ts-ignore
            [ElButton, ElButton,];
            const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({ ...{ 'onClick': {} }, size: ("small"), type: ("primary"), }));
            const __VLS_100 = __VLS_99({ ...{ 'onClick': {} }, size: ("small"), type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_99));
            ({}({ ...{ 'onClick': {} }, size: ("small"), type: ("primary"), }));
            let __VLS_104;
            const __VLS_105 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.userProfile?.articles?.items?.length)))
                        return;
                    __VLS_ctx.viewArticle(article);
                    // @ts-ignore
                    [viewArticle,];
                }
            };
            (__VLS_103.slots).default;
            const __VLS_103 = __VLS_pickFunctionalComponentCtx(__VLS_98, __VLS_100);
            let __VLS_101;
            let __VLS_102;
            const __VLS_106 = {}.ElButton;
            ({}.ElButton);
            ({}.ElButton);
            __VLS_components.ElButton;
            __VLS_components.elButton;
            __VLS_components.ElButton;
            __VLS_components.elButton;
            // @ts-ignore
            [ElButton, ElButton,];
            const __VLS_107 = __VLS_asFunctionalComponent(__VLS_106, new __VLS_106({ ...{ 'onClick': {} }, size: ("small"), type: ("warning"), }));
            const __VLS_108 = __VLS_107({ ...{ 'onClick': {} }, size: ("small"), type: ("warning"), }, ...__VLS_functionalComponentArgsRest(__VLS_107));
            ({}({ ...{ 'onClick': {} }, size: ("small"), type: ("warning"), }));
            let __VLS_112;
            const __VLS_113 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.userProfile?.articles?.items?.length)))
                        return;
                    __VLS_ctx.editArticle(article);
                    // @ts-ignore
                    [editArticle,];
                }
            };
            (__VLS_111.slots).default;
            const __VLS_111 = __VLS_pickFunctionalComponentCtx(__VLS_106, __VLS_108);
            let __VLS_109;
            let __VLS_110;
            const __VLS_114 = {}.ElButton;
            ({}.ElButton);
            ({}.ElButton);
            __VLS_components.ElButton;
            __VLS_components.elButton;
            __VLS_components.ElButton;
            __VLS_components.elButton;
            // @ts-ignore
            [ElButton, ElButton,];
            const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({ ...{ 'onClick': {} }, size: ("small"), type: ("danger"), }));
            const __VLS_116 = __VLS_115({ ...{ 'onClick': {} }, size: ("small"), type: ("danger"), }, ...__VLS_functionalComponentArgsRest(__VLS_115));
            ({}({ ...{ 'onClick': {} }, size: ("small"), type: ("danger"), }));
            let __VLS_120;
            const __VLS_121 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.userProfile?.articles?.items?.length)))
                        return;
                    __VLS_ctx.deleteArticle(article);
                    // @ts-ignore
                    [deleteArticle,];
                }
            };
            (__VLS_119.slots).default;
            const __VLS_119 = __VLS_pickFunctionalComponentCtx(__VLS_114, __VLS_116);
            let __VLS_117;
            let __VLS_118;
        }
        if (__VLS_ctx.userProfile.articles.total_articles > __VLS_ctx.userProfile.articles.page_size) {
            const __VLS_122 = {}.ElPagination;
            ({}.ElPagination);
            __VLS_components.ElPagination;
            __VLS_components.elPagination;
            // @ts-ignore
            [ElPagination,];
            const __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({ ...{ 'onCurrentChange': {} }, currentPage: ((__VLS_ctx.currentPage)), pageSize: ((__VLS_ctx.pageSize)), total: ((__VLS_ctx.userProfile.articles.total_articles)), layout: ("prev, pager, next"), ...{ class: ("pagination") }, }));
            const __VLS_124 = __VLS_123({ ...{ 'onCurrentChange': {} }, currentPage: ((__VLS_ctx.currentPage)), pageSize: ((__VLS_ctx.pageSize)), total: ((__VLS_ctx.userProfile.articles.total_articles)), layout: ("prev, pager, next"), ...{ class: ("pagination") }, }, ...__VLS_functionalComponentArgsRest(__VLS_123));
            ({}({ ...{ 'onCurrentChange': {} }, currentPage: ((__VLS_ctx.currentPage)), pageSize: ((__VLS_ctx.pageSize)), total: ((__VLS_ctx.userProfile.articles.total_articles)), layout: ("prev, pager, next"), ...{ class: ("pagination") }, }));
            let __VLS_128;
            const __VLS_129 = {
                onCurrentChange: (__VLS_ctx.handlePageChange)
            };
            // @ts-ignore
            [userProfile, userProfile, userProfile, currentPage, pageSize, handlePageChange,];
            const __VLS_127 = __VLS_pickFunctionalComponentCtx(__VLS_122, __VLS_124);
            let __VLS_125;
            let __VLS_126;
        }
    }
    else {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("no-articles") }, });
        const __VLS_130 = {}.ElEmpty;
        ({}.ElEmpty);
        ({}.ElEmpty);
        __VLS_components.ElEmpty;
        __VLS_components.elEmpty;
        __VLS_components.ElEmpty;
        __VLS_components.elEmpty;
        // @ts-ignore
        [ElEmpty, ElEmpty,];
        const __VLS_131 = __VLS_asFunctionalComponent(__VLS_130, new __VLS_130({ description: ("您还没有发表过文章"), }));
        const __VLS_132 = __VLS_131({ description: ("您还没有发表过文章"), }, ...__VLS_functionalComponentArgsRest(__VLS_131));
        ({}({ description: ("您还没有发表过文章"), }));
        const __VLS_136 = {}.ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({ ...{ 'onClick': {} }, type: ("primary"), }));
        const __VLS_138 = __VLS_137({ ...{ 'onClick': {} }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_137));
        ({}({ ...{ 'onClick': {} }, type: ("primary"), }));
        let __VLS_142;
        const __VLS_143 = {
            onClick: (...[$event]) => {
                if (!(!((__VLS_ctx.userProfile?.articles?.items?.length))))
                    return;
                __VLS_ctx.createArticleVisible = true;
                // @ts-ignore
                [createArticleVisible,];
            }
        };
        (__VLS_141.slots).default;
        const __VLS_141 = __VLS_pickFunctionalComponentCtx(__VLS_136, __VLS_138);
        let __VLS_139;
        let __VLS_140;
        (__VLS_135.slots).default;
        const __VLS_135 = __VLS_pickFunctionalComponentCtx(__VLS_130, __VLS_132);
    }
    const __VLS_89 = __VLS_pickFunctionalComponentCtx(__VLS_84, __VLS_86);
    const __VLS_144 = {}.ElDialog;
    ({}.ElDialog);
    ({}.ElDialog);
    __VLS_components.ElDialog;
    __VLS_components.elDialog;
    __VLS_components.ElDialog;
    __VLS_components.elDialog;
    // @ts-ignore
    [ElDialog, ElDialog,];
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({ ...{ 'onClose': {} }, modelValue: ((__VLS_ctx.createArticleVisible)), title: ((__VLS_ctx.isEditingArticle ? '编辑文章' : '发表文章')), width: ("70%"), closeOnClickModal: ((false)), }));
    const __VLS_146 = __VLS_145({ ...{ 'onClose': {} }, modelValue: ((__VLS_ctx.createArticleVisible)), title: ((__VLS_ctx.isEditingArticle ? '编辑文章' : '发表文章')), width: ("70%"), closeOnClickModal: ((false)), }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    ({}({ ...{ 'onClose': {} }, modelValue: ((__VLS_ctx.createArticleVisible)), title: ((__VLS_ctx.isEditingArticle ? '编辑文章' : '发表文章')), width: ("70%"), closeOnClickModal: ((false)), }));
    let __VLS_150;
    const __VLS_151 = {
        onClose: (__VLS_ctx.resetArticleForm)
    };
    const __VLS_152 = {}.ElForm;
    ({}.ElForm);
    ({}.ElForm);
    __VLS_components.ElForm;
    __VLS_components.elForm;
    __VLS_components.ElForm;
    __VLS_components.elForm;
    // @ts-ignore
    [ElForm, ElForm,];
    const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({ model: ((__VLS_ctx.articleForm)), labelWidth: ("80px"), }));
    const __VLS_154 = __VLS_153({ model: ((__VLS_ctx.articleForm)), labelWidth: ("80px"), }, ...__VLS_functionalComponentArgsRest(__VLS_153));
    ({}({ model: ((__VLS_ctx.articleForm)), labelWidth: ("80px"), }));
    const __VLS_158 = {}.ElFormItem;
    ({}.ElFormItem);
    ({}.ElFormItem);
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    // @ts-ignore
    [ElFormItem, ElFormItem,];
    const __VLS_159 = __VLS_asFunctionalComponent(__VLS_158, new __VLS_158({ label: ("标题"), required: (true), }));
    const __VLS_160 = __VLS_159({ label: ("标题"), required: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_159));
    ({}({ label: ("标题"), required: (true), }));
    const __VLS_164 = {}.ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({ modelValue: ((__VLS_ctx.articleForm.title)), placeholder: ("请输入文章标题"), maxlength: ("100"), showWordLimit: (true), }));
    const __VLS_166 = __VLS_165({ modelValue: ((__VLS_ctx.articleForm.title)), placeholder: ("请输入文章标题"), maxlength: ("100"), showWordLimit: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_165));
    ({}({ modelValue: ((__VLS_ctx.articleForm.title)), placeholder: ("请输入文章标题"), maxlength: ("100"), showWordLimit: (true), }));
    // @ts-ignore
    [createArticleVisible, isEditingArticle, resetArticleForm, articleForm, articleForm,];
    const __VLS_169 = __VLS_pickFunctionalComponentCtx(__VLS_164, __VLS_166);
    (__VLS_163.slots).default;
    const __VLS_163 = __VLS_pickFunctionalComponentCtx(__VLS_158, __VLS_160);
    const __VLS_170 = {}.ElFormItem;
    ({}.ElFormItem);
    ({}.ElFormItem);
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    // @ts-ignore
    [ElFormItem, ElFormItem,];
    const __VLS_171 = __VLS_asFunctionalComponent(__VLS_170, new __VLS_170({ label: ("预览"), required: (true), }));
    const __VLS_172 = __VLS_171({ label: ("预览"), required: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_171));
    ({}({ label: ("预览"), required: (true), }));
    const __VLS_176 = {}.ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({ modelValue: ((__VLS_ctx.articleForm.preview)), type: ("textarea"), rows: ((3)), placeholder: ("请输入文章预览（简短描述）"), maxlength: ("200"), showWordLimit: (true), }));
    const __VLS_178 = __VLS_177({ modelValue: ((__VLS_ctx.articleForm.preview)), type: ("textarea"), rows: ((3)), placeholder: ("请输入文章预览（简短描述）"), maxlength: ("200"), showWordLimit: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_177));
    ({}({ modelValue: ((__VLS_ctx.articleForm.preview)), type: ("textarea"), rows: ((3)), placeholder: ("请输入文章预览（简短描述）"), maxlength: ("200"), showWordLimit: (true), }));
    // @ts-ignore
    [articleForm,];
    const __VLS_181 = __VLS_pickFunctionalComponentCtx(__VLS_176, __VLS_178);
    (__VLS_175.slots).default;
    const __VLS_175 = __VLS_pickFunctionalComponentCtx(__VLS_170, __VLS_172);
    const __VLS_182 = {}.ElFormItem;
    ({}.ElFormItem);
    ({}.ElFormItem);
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    // @ts-ignore
    [ElFormItem, ElFormItem,];
    const __VLS_183 = __VLS_asFunctionalComponent(__VLS_182, new __VLS_182({ label: ("内容"), required: (true), }));
    const __VLS_184 = __VLS_183({ label: ("内容"), required: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_183));
    ({}({ label: ("内容"), required: (true), }));
    const __VLS_188 = {}.ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({ modelValue: ((__VLS_ctx.articleForm.content)), type: ("textarea"), rows: ((10)), placeholder: ("请输入文章内容"), maxlength: ("5000"), showWordLimit: (true), }));
    const __VLS_190 = __VLS_189({ modelValue: ((__VLS_ctx.articleForm.content)), type: ("textarea"), rows: ((10)), placeholder: ("请输入文章内容"), maxlength: ("5000"), showWordLimit: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_189));
    ({}({ modelValue: ((__VLS_ctx.articleForm.content)), type: ("textarea"), rows: ((10)), placeholder: ("请输入文章内容"), maxlength: ("5000"), showWordLimit: (true), }));
    // @ts-ignore
    [articleForm,];
    const __VLS_193 = __VLS_pickFunctionalComponentCtx(__VLS_188, __VLS_190);
    (__VLS_187.slots).default;
    const __VLS_187 = __VLS_pickFunctionalComponentCtx(__VLS_182, __VLS_184);
    (__VLS_157.slots).default;
    const __VLS_157 = __VLS_pickFunctionalComponentCtx(__VLS_152, __VLS_154);
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        (__VLS_149.slots).footer;
        const __VLS_194 = {}.ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        const __VLS_195 = __VLS_asFunctionalComponent(__VLS_194, new __VLS_194({ ...{ 'onClick': {} }, }));
        const __VLS_196 = __VLS_195({ ...{ 'onClick': {} }, }, ...__VLS_functionalComponentArgsRest(__VLS_195));
        ({}({ ...{ 'onClick': {} }, }));
        let __VLS_200;
        const __VLS_201 = {
            onClick: (...[$event]) => {
                __VLS_ctx.createArticleVisible = false;
                // @ts-ignore
                [createArticleVisible,];
            }
        };
        (__VLS_199.slots).default;
        const __VLS_199 = __VLS_pickFunctionalComponentCtx(__VLS_194, __VLS_196);
        let __VLS_197;
        let __VLS_198;
        const __VLS_202 = {}.ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        const __VLS_203 = __VLS_asFunctionalComponent(__VLS_202, new __VLS_202({ ...{ 'onClick': {} }, type: ("primary"), }));
        const __VLS_204 = __VLS_203({ ...{ 'onClick': {} }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_203));
        ({}({ ...{ 'onClick': {} }, type: ("primary"), }));
        let __VLS_208;
        const __VLS_209 = {
            onClick: (__VLS_ctx.submitArticle)
        };
        (__VLS_ctx.isEditingArticle ? '更新' : '发表');
        // @ts-ignore
        [isEditingArticle, submitArticle,];
        (__VLS_207.slots).default;
        const __VLS_207 = __VLS_pickFunctionalComponentCtx(__VLS_202, __VLS_204);
        let __VLS_205;
        let __VLS_206;
    }
    const __VLS_149 = __VLS_pickFunctionalComponentCtx(__VLS_144, __VLS_146);
    let __VLS_147;
    let __VLS_148;
    (__VLS_11.slots).default;
    const __VLS_11 = __VLS_pickFunctionalComponentCtx(__VLS_6, __VLS_8);
    (__VLS_5.slots).default;
    const __VLS_5 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2);
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses['profile-container'];
        __VLS_styleScopedClasses['profile-header'];
        __VLS_styleScopedClasses['profile-card'];
        __VLS_styleScopedClasses['card-header'];
        __VLS_styleScopedClasses['profile-display'];
        __VLS_styleScopedClasses['info-item'];
        __VLS_styleScopedClasses['info-item'];
        __VLS_styleScopedClasses['info-item'];
        __VLS_styleScopedClasses['info-item'];
        __VLS_styleScopedClasses['profile-edit'];
        __VLS_styleScopedClasses['articles-card'];
        __VLS_styleScopedClasses['card-header'];
        __VLS_styleScopedClasses['articles-list'];
        __VLS_styleScopedClasses['article-item'];
        __VLS_styleScopedClasses['article-info'];
        __VLS_styleScopedClasses['article-preview'];
        __VLS_styleScopedClasses['article-actions'];
        __VLS_styleScopedClasses['pagination'];
        __VLS_styleScopedClasses['no-articles'];
    }
    var __VLS_slots;
    return __VLS_slots;
    const __VLS_componentsOption = {};
    let __VLS_name;
    const __VLS_internalComponent = (await import('vue')).defineComponent({
        setup() {
            return {
                userProfile: userProfile,
                editMode: editMode,
                createArticleVisible: createArticleVisible,
                currentPage: currentPage,
                pageSize: pageSize,
                isEditingArticle: isEditingArticle,
                editForm: editForm,
                articleForm: articleForm,
                updateProfile: updateProfile,
                submitArticle: submitArticle,
                resetArticleForm: resetArticleForm,
                viewArticle: viewArticle,
                editArticle: editArticle,
                deleteArticle: deleteArticle,
                handlePageChange: handlePageChange,
            };
        },
    });
}
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
;
