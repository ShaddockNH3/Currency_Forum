/* __placeholder__ */
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import axios from '../axios';
import { useAuthStore } from '../store/auth';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const articles = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const totalArticles = ref(0);
const loading = ref(false);
const router = useRouter();
const authStore = useAuthStore();
const fetchArticles = async () => {
    if (!authStore.isAuthenticated) {
        ElMessage.warning('请先登录后再查看文章');
        return;
    }
    loading.value = true;
    try {
        const response = await axios.get('/articles', {
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
    }
    catch (error) {
        console.error('Failed to load articles:', error);
        if (error.response?.status === 401) {
            ElMessage.error('请先登录');
            router.push('/login');
        }
        else {
            ElMessage.error('加载文章失败');
        }
    }
    finally {
        loading.value = false;
    }
};
const handleSizeChange = (newSize) => {
    pageSize.value = newSize;
    currentPage.value = 1;
    fetchArticles();
};
const handleCurrentChange = (newPage) => {
    currentPage.value = newPage;
    fetchArticles();
};
const viewDetail = (id) => {
    if (!authStore.isAuthenticated) {
        ElMessage.error('请先登录后再查看');
        return;
    }
    router.push({ name: 'NewsDetail', params: { id: id.toString() } });
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
    }
    else {
        articles.value = [];
        totalArticles.value = 0;
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
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("articles-container") }, });
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
            __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
            (article.title);
            // @ts-ignore
            [articles, articles, articles,];
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("article-preview") }, });
            (article.preview);
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("article-meta") }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("author") }, });
            (article.author);
            const __VLS_18 = {}.ElButton;
            ({}.ElButton);
            ({}.ElButton);
            __VLS_components.ElButton;
            __VLS_components.elButton;
            __VLS_components.ElButton;
            __VLS_components.elButton;
            // @ts-ignore
            [ElButton, ElButton,];
            const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({ ...{ 'onClick': {} }, text: (true), }));
            const __VLS_20 = __VLS_19({ ...{ 'onClick': {} }, text: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_19));
            ({}({ ...{ 'onClick': {} }, text: (true), }));
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
            (__VLS_17.slots).default;
            const __VLS_17 = __VLS_pickFunctionalComponentCtx(__VLS_12, __VLS_14);
        }
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("pagination-container") }, });
        const __VLS_26 = {}.ElPagination;
        ({}.ElPagination);
        __VLS_components.ElPagination;
        __VLS_components.elPagination;
        // @ts-ignore
        [ElPagination,];
        const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({ ...{ 'onSizeChange': {} }, ...{ 'onCurrentChange': {} }, currentPage: ((__VLS_ctx.currentPage)), pageSize: ((__VLS_ctx.pageSize)), pageSizes: (([10, 20, 50, 100])), total: ((__VLS_ctx.totalArticles)), layout: ("total, sizes, prev, pager, next, jumper"), }));
        const __VLS_28 = __VLS_27({ ...{ 'onSizeChange': {} }, ...{ 'onCurrentChange': {} }, currentPage: ((__VLS_ctx.currentPage)), pageSize: ((__VLS_ctx.pageSize)), pageSizes: (([10, 20, 50, 100])), total: ((__VLS_ctx.totalArticles)), layout: ("total, sizes, prev, pager, next, jumper"), }, ...__VLS_functionalComponentArgsRest(__VLS_27));
        ({}({ ...{ 'onSizeChange': {} }, ...{ 'onCurrentChange': {} }, currentPage: ((__VLS_ctx.currentPage)), pageSize: ((__VLS_ctx.pageSize)), pageSizes: (([10, 20, 50, 100])), total: ((__VLS_ctx.totalArticles)), layout: ("total, sizes, prev, pager, next, jumper"), }));
        let __VLS_32;
        const __VLS_33 = {
            onSizeChange: (__VLS_ctx.handleSizeChange)
        };
        const __VLS_34 = {
            onCurrentChange: (__VLS_ctx.handleCurrentChange)
        };
        // @ts-ignore
        [currentPage, pageSize, totalArticles, handleSizeChange, handleCurrentChange,];
        const __VLS_31 = __VLS_pickFunctionalComponentCtx(__VLS_26, __VLS_28);
        let __VLS_29;
        let __VLS_30;
    }
    else if (__VLS_ctx.loading) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("loading") }, });
        const __VLS_35 = {}.ElLoadingComponent;
        ({}.ElLoadingComponent);
        __VLS_components.ElLoadingComponent;
        __VLS_components.elLoadingComponent;
        // @ts-ignore
        [ElLoadingComponent,];
        const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({}));
        const __VLS_37 = __VLS_36({}, ...__VLS_functionalComponentArgsRest(__VLS_36));
        ({}({}));
        // @ts-ignore
        [loading,];
        const __VLS_40 = __VLS_pickFunctionalComponentCtx(__VLS_35, __VLS_37);
    }
    else {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("no-data") }, });
        const __VLS_41 = {}.ElEmpty;
        ({}.ElEmpty);
        __VLS_components.ElEmpty;
        __VLS_components.elEmpty;
        // @ts-ignore
        [ElEmpty,];
        const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({ description: ("暂无文章"), }));
        const __VLS_43 = __VLS_42({ description: ("暂无文章"), }, ...__VLS_functionalComponentArgsRest(__VLS_42));
        ({}({ description: ("暂无文章"), }));
        const __VLS_46 = __VLS_pickFunctionalComponentCtx(__VLS_41, __VLS_43);
    }
    (__VLS_11.slots).default;
    const __VLS_11 = __VLS_pickFunctionalComponentCtx(__VLS_6, __VLS_8);
    (__VLS_5.slots).default;
    const __VLS_5 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2);
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses['articles-container'];
        __VLS_styleScopedClasses['article-card'];
        __VLS_styleScopedClasses['article-preview'];
        __VLS_styleScopedClasses['article-meta'];
        __VLS_styleScopedClasses['author'];
        __VLS_styleScopedClasses['pagination-container'];
        __VLS_styleScopedClasses['loading'];
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
                currentPage: currentPage,
                pageSize: pageSize,
                totalArticles: totalArticles,
                loading: loading,
                handleSizeChange: handleSizeChange,
                handleCurrentChange: handleCurrentChange,
                viewDetail: viewDetail,
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
