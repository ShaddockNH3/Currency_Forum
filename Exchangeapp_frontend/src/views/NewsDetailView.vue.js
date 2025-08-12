/* __placeholder__ */
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "../axios";
import { useAuthStore } from '../store/auth';
import { ElMessage } from 'element-plus';
import { Star } from '@element-plus/icons-vue';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const article = ref(null);
const route = useRoute();
const router = useRouter();
const likes = ref(0);
const loading = ref(true);
const liking = ref(false);
const authStore = useAuthStore();
const { id } = route.params;
const formatDate = (dateString) => {
    if (!dateString)
        return '';
    return new Date(dateString).toLocaleString('zh-CN');
};
const fetchArticle = async () => {
    if (!authStore.isAuthenticated) {
        ElMessage.error('请先登录后再查看文章');
        router.push('/login');
        return;
    }
    loading.value = true;
    try {
        const response = await axios.get(`/articles/${id}`);
        article.value = response.data;
        await fetchLike();
    }
    catch (error) {
        console.error("Failed to load article:", error);
        if (error.response?.status === 401) {
            ElMessage.error('请先登录');
            router.push('/login');
        }
        else if (error.response?.status === 404) {
            ElMessage.error('文章不存在');
        }
        else {
            ElMessage.error('加载文章失败');
        }
    }
    finally {
        loading.value = false;
    }
};
const likeArticle = async () => {
    if (!authStore.isAuthenticated) {
        ElMessage.error('请先登录后再点赞');
        return;
    }
    liking.value = true;
    try {
        const res = await axios.post(`/articles/${id}/like`);
        likes.value = res.data.likes;
        ElMessage.success('点赞成功');
    }
    catch (error) {
        console.log('Error Liking article:', error);
        if (error.response?.status === 401) {
            ElMessage.error('请先登录');
        }
        else {
            ElMessage.error('点赞失败，请稍后重试');
        }
    }
    finally {
        liking.value = false;
    }
};
const fetchLike = async () => {
    try {
        const res = await axios.get(`/articles/${id}/like`);
        likes.value = res.data.likes;
    }
    catch (error) {
        console.log('Error fetching likes:', error);
        // 点赞数获取失败不影响文章显示
    }
};
onMounted(() => {
    if (authStore.isAuthenticated) {
        fetchArticle();
    }
    else {
        ElMessage.error('请先登录后再查看文章');
        router.push('/login');
    }
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
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
    const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
    ({}({}));
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
    if (__VLS_ctx.loading) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("loading") }, });
        const __VLS_12 = {}.ElLoadingComponent;
        ({}.ElLoadingComponent);
        __VLS_components.ElLoadingComponent;
        __VLS_components.elLoadingComponent;
        // @ts-ignore
        [ElLoadingComponent,];
        const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({}));
        const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
        ({}({}));
        // @ts-ignore
        [loading,];
        const __VLS_17 = __VLS_pickFunctionalComponentCtx(__VLS_12, __VLS_14);
    }
    else if (__VLS_ctx.article) {
        const __VLS_18 = {}.ElCard;
        ({}.ElCard);
        ({}.ElCard);
        __VLS_components.ElCard;
        __VLS_components.elCard;
        __VLS_components.ElCard;
        __VLS_components.elCard;
        // @ts-ignore
        [ElCard, ElCard,];
        const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({ ...{ class: ("article-detail") }, }));
        const __VLS_20 = __VLS_19({ ...{ class: ("article-detail") }, }, ...__VLS_functionalComponentArgsRest(__VLS_19));
        ({}({ ...{ class: ("article-detail") }, }));
        __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({ ...{ class: ("article-title") }, });
        (__VLS_ctx.article.title);
        // @ts-ignore
        [article, article,];
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("article-meta") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("author") }, });
        (__VLS_ctx.article.author);
        // @ts-ignore
        [article,];
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("date") }, });
        (__VLS_ctx.formatDate(__VLS_ctx.article.created_at));
        // @ts-ignore
        [article, formatDate,];
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("article-content") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        (__VLS_ctx.article.content);
        // @ts-ignore
        [article,];
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("article-actions") }, });
        const __VLS_24 = {}.ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({ ...{ 'onClick': {} }, type: ("primary"), loading: ((__VLS_ctx.liking)), }));
        const __VLS_26 = __VLS_25({ ...{ 'onClick': {} }, type: ("primary"), loading: ((__VLS_ctx.liking)), }, ...__VLS_functionalComponentArgsRest(__VLS_25));
        ({}({ ...{ 'onClick': {} }, type: ("primary"), loading: ((__VLS_ctx.liking)), }));
        let __VLS_30;
        const __VLS_31 = {
            onClick: (__VLS_ctx.likeArticle)
        };
        const __VLS_32 = {}.ElIcon;
        ({}.ElIcon);
        ({}.ElIcon);
        __VLS_components.ElIcon;
        __VLS_components.elIcon;
        __VLS_components.ElIcon;
        __VLS_components.elIcon;
        // @ts-ignore
        [ElIcon, ElIcon,];
        const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({}));
        const __VLS_34 = __VLS_33({}, ...__VLS_functionalComponentArgsRest(__VLS_33));
        ({}({}));
        const __VLS_38 = {}.Star;
        ({}.Star);
        __VLS_components.Star;
        // @ts-ignore
        [Star,];
        const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({}));
        const __VLS_40 = __VLS_39({}, ...__VLS_functionalComponentArgsRest(__VLS_39));
        ({}({}));
        // @ts-ignore
        [liking, likeArticle,];
        const __VLS_43 = __VLS_pickFunctionalComponentCtx(__VLS_38, __VLS_40);
        (__VLS_37.slots).default;
        const __VLS_37 = __VLS_pickFunctionalComponentCtx(__VLS_32, __VLS_34);
        (__VLS_29.slots).default;
        const __VLS_29 = __VLS_pickFunctionalComponentCtx(__VLS_24, __VLS_26);
        let __VLS_27;
        let __VLS_28;
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("likes-count") }, });
        (__VLS_ctx.likes);
        // @ts-ignore
        [likes,];
        (__VLS_23.slots).default;
        const __VLS_23 = __VLS_pickFunctionalComponentCtx(__VLS_18, __VLS_20);
    }
    else {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("no-data") }, });
        const __VLS_44 = {}.ElEmpty;
        ({}.ElEmpty);
        __VLS_components.ElEmpty;
        __VLS_components.elEmpty;
        // @ts-ignore
        [ElEmpty,];
        const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({ description: ("文章不存在或已被删除"), }));
        const __VLS_46 = __VLS_45({ description: ("文章不存在或已被删除"), }, ...__VLS_functionalComponentArgsRest(__VLS_45));
        ({}({ description: ("文章不存在或已被删除"), }));
        const __VLS_49 = __VLS_pickFunctionalComponentCtx(__VLS_44, __VLS_46);
    }
    (__VLS_11.slots).default;
    const __VLS_11 = __VLS_pickFunctionalComponentCtx(__VLS_6, __VLS_8);
    (__VLS_5.slots).default;
    const __VLS_5 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2);
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses['loading'];
        __VLS_styleScopedClasses['article-detail'];
        __VLS_styleScopedClasses['article-title'];
        __VLS_styleScopedClasses['article-meta'];
        __VLS_styleScopedClasses['author'];
        __VLS_styleScopedClasses['date'];
        __VLS_styleScopedClasses['article-content'];
        __VLS_styleScopedClasses['article-actions'];
        __VLS_styleScopedClasses['likes-count'];
        __VLS_styleScopedClasses['no-data'];
    }
    var __VLS_slots;
    return __VLS_slots;
    const __VLS_componentsOption = {};
    let __VLS_name;
    const __VLS_internalComponent = (await import('vue')).defineComponent({
        setup() {
            return {
                Star: Star,
                article: article,
                likes: likes,
                loading: loading,
                liking: liking,
                formatDate: formatDate,
                likeArticle: likeArticle,
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
