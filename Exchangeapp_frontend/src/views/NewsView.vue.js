/* __placeholder__ */
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import axios from '../axios';
import { useAuthStore } from '../store/auth';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const articles = ref([]);
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
        const response = await axios.get('/articles', {
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
        }
        else if (Array.isArray(articleData)) {
            // 如果直接返回数组
            articles.value = articleData;
            totalArticles.value = articleData.length;
        }
        else {
            articles.value = [];
            totalArticles.value = 0;
        }
        console.log('处理后的文章数据:', articles.value);
    }
    catch (error) {
        console.error('Failed to load articles:', error);
        if (error.response?.status === 401) {
            ElMessage.error('登录已过期，请重新登录');
            authStore.logout();
            router.push({ name: 'Login' });
        }
        else {
            ElMessage.error('加载文章失败');
        }
    }
};
const viewDetail = (articleId) => {
    if (!authStore.isAuthenticated) {
        ElMessage.error('请先登录后再查看');
        return;
    }
    router.push({ name: 'NewsDetail', params: { id: articleId.toString() } });
};
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-CN');
};
// 分页处理
const handlePageChange = (page) => {
    console.log(`切换到第${page}页`);
    fetchArticles(page);
};
// 权限检查 - 只有管理员或文章作者可以删除文章
const canDeleteArticle = (article) => {
    return authStore.userInfo?.role === 'admin' ||
        authStore.userInfo?.username === article.author;
};
// 删除文章
const deleteArticle = async (articleId) => {
    try {
        await ElMessageBox.confirm('确定要删除这篇文章吗？', '确认删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        });
        await axios.delete(`/articles/${articleId}`);
        await fetchArticles(currentPage.value); // 重新获取当前页文章
        ElMessage.success('文章删除成功！');
    }
    catch (error) {
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
    }
    else {
        articles.value = [];
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
    if (__VLS_ctx.articles && __VLS_ctx.articles.length) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        for (const [article] of __VLS_getVForSourceType((__VLS_ctx.articles))) {
            const __VLS_12 = {}.ElCard;
            ({}.ElCard);
            ({}.ElCard);
            __VLS_components.ElCard;
            __VLS_components.elCard;
            __VLS_components.ElCard;
            __VLS_components.elCard;
            // @ts-ignore
            [ElCard, ElCard,];
            const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({ key: ((article.id)), ...{ class: ("article-card") }, }));
            const __VLS_14 = __VLS_13({ key: ((article.id)), ...{ class: ("article-card") }, }, ...__VLS_functionalComponentArgsRest(__VLS_13));
            ({}({ key: ((article.id)), ...{ class: ("article-card") }, }));
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("article-header") }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
            (article.title);
            // @ts-ignore
            [articles, articles, articles,];
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("author") }, });
            (article.author);
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("preview") }, });
            (article.preview);
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("article-footer") }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("date") }, });
            (__VLS_ctx.formatDate(article.created_at));
            // @ts-ignore
            [formatDate,];
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("article-actions") }, });
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
                    if (!((__VLS_ctx.articles && __VLS_ctx.articles.length)))
                        return;
                    __VLS_ctx.viewDetail(article.id);
                    // @ts-ignore
                    [viewDetail,];
                }
            };
            (__VLS_23.slots).default;
            const __VLS_23 = __VLS_pickFunctionalComponentCtx(__VLS_18, __VLS_20);
            let __VLS_21;
            let __VLS_22;
            if (__VLS_ctx.canDeleteArticle(article)) {
                const __VLS_26 = {}.ElButton;
                ({}.ElButton);
                ({}.ElButton);
                __VLS_components.ElButton;
                __VLS_components.elButton;
                __VLS_components.ElButton;
                __VLS_components.elButton;
                // @ts-ignore
                [ElButton, ElButton,];
                const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({ ...{ 'onClick': {} }, type: ("danger"), size: ("small"), }));
                const __VLS_28 = __VLS_27({ ...{ 'onClick': {} }, type: ("danger"), size: ("small"), }, ...__VLS_functionalComponentArgsRest(__VLS_27));
                ({}({ ...{ 'onClick': {} }, type: ("danger"), size: ("small"), }));
                let __VLS_32;
                const __VLS_33 = {
                    onClick: (...[$event]) => {
                        if (!((__VLS_ctx.articles && __VLS_ctx.articles.length)))
                            return;
                        if (!((__VLS_ctx.canDeleteArticle(article))))
                            return;
                        __VLS_ctx.deleteArticle(article.id);
                        // @ts-ignore
                        [canDeleteArticle, deleteArticle,];
                    }
                };
                (__VLS_31.slots).default;
                const __VLS_31 = __VLS_pickFunctionalComponentCtx(__VLS_26, __VLS_28);
                let __VLS_29;
                let __VLS_30;
            }
            (__VLS_17.slots).default;
            const __VLS_17 = __VLS_pickFunctionalComponentCtx(__VLS_12, __VLS_14);
        }
        if (__VLS_ctx.totalArticles > __VLS_ctx.pageSize) {
            const __VLS_34 = {}.ElPagination;
            ({}.ElPagination);
            __VLS_components.ElPagination;
            __VLS_components.elPagination;
            // @ts-ignore
            [ElPagination,];
            const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({ ...{ 'onCurrentChange': {} }, currentPage: ((__VLS_ctx.currentPage)), pageSize: ((__VLS_ctx.pageSize)), total: ((__VLS_ctx.totalArticles)), layout: ("prev, pager, next, total"), ...{ class: ("pagination") }, }));
            const __VLS_36 = __VLS_35({ ...{ 'onCurrentChange': {} }, currentPage: ((__VLS_ctx.currentPage)), pageSize: ((__VLS_ctx.pageSize)), total: ((__VLS_ctx.totalArticles)), layout: ("prev, pager, next, total"), ...{ class: ("pagination") }, }, ...__VLS_functionalComponentArgsRest(__VLS_35));
            ({}({ ...{ 'onCurrentChange': {} }, currentPage: ((__VLS_ctx.currentPage)), pageSize: ((__VLS_ctx.pageSize)), total: ((__VLS_ctx.totalArticles)), layout: ("prev, pager, next, total"), ...{ class: ("pagination") }, }));
            let __VLS_40;
            const __VLS_41 = {
                onCurrentChange: (__VLS_ctx.handlePageChange)
            };
            // @ts-ignore
            [totalArticles, totalArticles, pageSize, pageSize, currentPage, handlePageChange,];
            const __VLS_39 = __VLS_pickFunctionalComponentCtx(__VLS_34, __VLS_36);
            let __VLS_37;
            let __VLS_38;
        }
    }
    else if (!__VLS_ctx.authStore.isAuthenticated) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("no-data") }, });
        // @ts-ignore
        [authStore,];
    }
    else {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("no-data") }, });
    }
    (__VLS_11.slots).default;
    const __VLS_11 = __VLS_pickFunctionalComponentCtx(__VLS_6, __VLS_8);
    (__VLS_5.slots).default;
    const __VLS_5 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2);
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses['article-card'];
        __VLS_styleScopedClasses['article-header'];
        __VLS_styleScopedClasses['author'];
        __VLS_styleScopedClasses['preview'];
        __VLS_styleScopedClasses['article-footer'];
        __VLS_styleScopedClasses['date'];
        __VLS_styleScopedClasses['article-actions'];
        __VLS_styleScopedClasses['pagination'];
        __VLS_styleScopedClasses['no-data'];
        __VLS_styleScopedClasses['no-data'];
    }
    var __VLS_slots;
    return __VLS_slots;
    const __VLS_componentsOption = {};
    let __VLS_name;
    const __VLS_internalComponent = (await import('vue')).defineComponent({
        setup() {
            return {
                articles: articles,
                authStore: authStore,
                currentPage: currentPage,
                pageSize: pageSize,
                totalArticles: totalArticles,
                viewDetail: viewDetail,
                formatDate: formatDate,
                handlePageChange: handlePageChange,
                canDeleteArticle: canDeleteArticle,
                deleteArticle: deleteArticle,
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
