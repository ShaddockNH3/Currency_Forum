/* __placeholder__ */
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import axios from '../axios';
import { useAuthStore } from '../store/auth';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const userData = ref(null);
const loading = ref(true);
const currentPage = ref(1);
const pageSize = ref(10);
const username = computed(() => route.params.username);
const formatDate = (dateString) => {
    if (!dateString)
        return '';
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
        const response = await axios.get(`/users/${username.value}`, {
            params: {
                page: currentPage.value,
                page_size: pageSize.value
            }
        });
        userData.value = response.data;
        currentPage.value = response.data.articles.page;
        pageSize.value = response.data.articles.page_size;
    }
    catch (error) {
        console.error('Failed to load user profile:', error);
        if (error.response?.status === 401) {
            ElMessage.error('请先登录');
            router.push('/login');
        }
        else if (error.response?.status === 404) {
            ElMessage.error('用户不存在');
        }
        else {
            ElMessage.error('加载用户资料失败');
        }
    }
    finally {
        loading.value = false;
    }
};
const handleSizeChange = (newSize) => {
    pageSize.value = newSize;
    currentPage.value = 1;
    fetchUserProfile();
};
const handleCurrentChange = (newPage) => {
    currentPage.value = newPage;
    fetchUserProfile();
};
const viewArticle = (articleId) => {
    router.push({ name: 'NewsDetail', params: { id: articleId.toString() } });
};
onMounted(() => {
    if (authStore.isAuthenticated) {
        fetchUserProfile();
    }
    else {
        ElMessage.error('请先登录');
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
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ...{ class: ("user-profile-container") }, }));
    const __VLS_2 = __VLS_1({ ...{ class: ("user-profile-container") }, }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    ({}({ ...{ class: ("user-profile-container") }, }));
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
    else if (__VLS_ctx.userData) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("profile-content") }, });
        const __VLS_18 = {}.ElCard;
        ({}.ElCard);
        ({}.ElCard);
        __VLS_components.ElCard;
        __VLS_components.elCard;
        __VLS_components.ElCard;
        __VLS_components.elCard;
        // @ts-ignore
        [ElCard, ElCard,];
        const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({ ...{ class: ("profile-card") }, }));
        const __VLS_20 = __VLS_19({ ...{ class: ("profile-card") }, }, ...__VLS_functionalComponentArgsRest(__VLS_19));
        ({}({ ...{ class: ("profile-card") }, }));
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("profile-header") }, });
        const __VLS_24 = {}.ElAvatar;
        ({}.ElAvatar);
        __VLS_components.ElAvatar;
        __VLS_components.elAvatar;
        // @ts-ignore
        [ElAvatar,];
        const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({ size: ((80)), icon: ("UserFilled"), }));
        const __VLS_26 = __VLS_25({ size: ((80)), icon: ("UserFilled"), }, ...__VLS_functionalComponentArgsRest(__VLS_25));
        ({}({ size: ((80)), icon: ("UserFilled"), }));
        // @ts-ignore
        [userData,];
        const __VLS_29 = __VLS_pickFunctionalComponentCtx(__VLS_24, __VLS_26);
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("profile-info") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
        (__VLS_ctx.userData.username);
        // @ts-ignore
        [userData,];
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("role") }, });
        (__VLS_ctx.userData.role === 'admin' ? '管理员' : '普通用户');
        // @ts-ignore
        [userData,];
        if (__VLS_ctx.userData.signature) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("signature") }, });
            (__VLS_ctx.userData.signature);
            // @ts-ignore
            [userData, userData,];
        }
        if (__VLS_ctx.userData.introduction) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("introduction") }, });
            (__VLS_ctx.userData.introduction);
            // @ts-ignore
            [userData, userData,];
        }
        (__VLS_23.slots).default;
        const __VLS_23 = __VLS_pickFunctionalComponentCtx(__VLS_18, __VLS_20);
        const __VLS_30 = {}.ElCard;
        ({}.ElCard);
        ({}.ElCard);
        __VLS_components.ElCard;
        __VLS_components.elCard;
        __VLS_components.ElCard;
        __VLS_components.elCard;
        // @ts-ignore
        [ElCard, ElCard,];
        const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({ ...{ class: ("articles-card") }, }));
        const __VLS_32 = __VLS_31({ ...{ class: ("articles-card") }, }, ...__VLS_functionalComponentArgsRest(__VLS_31));
        ({}({ ...{ class: ("articles-card") }, }));
        __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
        {
            (__VLS_35.slots).header;
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("card-header") }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.userData.articles.total_articles);
            // @ts-ignore
            [userData,];
        }
        if (__VLS_ctx.userData.articles.items && __VLS_ctx.userData.articles.items.length) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("articles-list") }, });
            for (const [article] of __VLS_getVForSourceType((__VLS_ctx.userData.articles.items))) {
                __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ key: ((article.id)), ...{ class: ("article-item") }, });
                __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({ ...{ class: ("article-title") }, });
                (article.title);
                // @ts-ignore
                [userData, userData, userData,];
                __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("article-preview") }, });
                (article.preview);
                __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("article-meta") }, });
                __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("article-date") }, });
                (__VLS_ctx.formatDate(article.created_at));
                // @ts-ignore
                [formatDate,];
                const __VLS_36 = {}.ElButton;
                ({}.ElButton);
                ({}.ElButton);
                __VLS_components.ElButton;
                __VLS_components.elButton;
                __VLS_components.ElButton;
                __VLS_components.elButton;
                // @ts-ignore
                [ElButton, ElButton,];
                const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({ ...{ 'onClick': {} }, text: (true), }));
                const __VLS_38 = __VLS_37({ ...{ 'onClick': {} }, text: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_37));
                ({}({ ...{ 'onClick': {} }, text: (true), }));
                let __VLS_42;
                const __VLS_43 = {
                    onClick: (...[$event]) => {
                        if (!(!((__VLS_ctx.loading))))
                            return;
                        if (!((__VLS_ctx.userData)))
                            return;
                        if (!((__VLS_ctx.userData.articles.items && __VLS_ctx.userData.articles.items.length)))
                            return;
                        __VLS_ctx.viewArticle(article.id);
                        // @ts-ignore
                        [viewArticle,];
                    }
                };
                (__VLS_41.slots).default;
                const __VLS_41 = __VLS_pickFunctionalComponentCtx(__VLS_36, __VLS_38);
                let __VLS_39;
                let __VLS_40;
            }
        }
        else {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("no-articles") }, });
            const __VLS_44 = {}.ElEmpty;
            ({}.ElEmpty);
            __VLS_components.ElEmpty;
            __VLS_components.elEmpty;
            // @ts-ignore
            [ElEmpty,];
            const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({ description: ("暂无文章"), }));
            const __VLS_46 = __VLS_45({ description: ("暂无文章"), }, ...__VLS_functionalComponentArgsRest(__VLS_45));
            ({}({ description: ("暂无文章"), }));
            const __VLS_49 = __VLS_pickFunctionalComponentCtx(__VLS_44, __VLS_46);
        }
        if (__VLS_ctx.userData.articles.total_articles > 0) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("pagination-container") }, });
            const __VLS_50 = {}.ElPagination;
            ({}.ElPagination);
            __VLS_components.ElPagination;
            __VLS_components.elPagination;
            // @ts-ignore
            [ElPagination,];
            const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({ ...{ 'onSizeChange': {} }, ...{ 'onCurrentChange': {} }, currentPage: ((__VLS_ctx.currentPage)), pageSize: ((__VLS_ctx.pageSize)), pageSizes: (([10, 20, 50, 100])), total: ((__VLS_ctx.userData.articles.total_articles)), layout: ("total, sizes, prev, pager, next, jumper"), }));
            const __VLS_52 = __VLS_51({ ...{ 'onSizeChange': {} }, ...{ 'onCurrentChange': {} }, currentPage: ((__VLS_ctx.currentPage)), pageSize: ((__VLS_ctx.pageSize)), pageSizes: (([10, 20, 50, 100])), total: ((__VLS_ctx.userData.articles.total_articles)), layout: ("total, sizes, prev, pager, next, jumper"), }, ...__VLS_functionalComponentArgsRest(__VLS_51));
            ({}({ ...{ 'onSizeChange': {} }, ...{ 'onCurrentChange': {} }, currentPage: ((__VLS_ctx.currentPage)), pageSize: ((__VLS_ctx.pageSize)), pageSizes: (([10, 20, 50, 100])), total: ((__VLS_ctx.userData.articles.total_articles)), layout: ("total, sizes, prev, pager, next, jumper"), }));
            let __VLS_56;
            const __VLS_57 = {
                onSizeChange: (__VLS_ctx.handleSizeChange)
            };
            const __VLS_58 = {
                onCurrentChange: (__VLS_ctx.handleCurrentChange)
            };
            // @ts-ignore
            [userData, userData, currentPage, pageSize, handleSizeChange, handleCurrentChange,];
            const __VLS_55 = __VLS_pickFunctionalComponentCtx(__VLS_50, __VLS_52);
            let __VLS_53;
            let __VLS_54;
        }
        const __VLS_35 = __VLS_pickFunctionalComponentCtx(__VLS_30, __VLS_32);
    }
    else {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("error-content") }, });
        const __VLS_59 = {}.ElEmpty;
        ({}.ElEmpty);
        __VLS_components.ElEmpty;
        __VLS_components.elEmpty;
        // @ts-ignore
        [ElEmpty,];
        const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({ description: ("用户不存在或加载失败"), }));
        const __VLS_61 = __VLS_60({ description: ("用户不存在或加载失败"), }, ...__VLS_functionalComponentArgsRest(__VLS_60));
        ({}({ description: ("用户不存在或加载失败"), }));
        const __VLS_64 = __VLS_pickFunctionalComponentCtx(__VLS_59, __VLS_61);
    }
    (__VLS_11.slots).default;
    const __VLS_11 = __VLS_pickFunctionalComponentCtx(__VLS_6, __VLS_8);
    (__VLS_5.slots).default;
    const __VLS_5 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2);
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses['user-profile-container'];
        __VLS_styleScopedClasses['loading'];
        __VLS_styleScopedClasses['profile-content'];
        __VLS_styleScopedClasses['profile-card'];
        __VLS_styleScopedClasses['profile-header'];
        __VLS_styleScopedClasses['profile-info'];
        __VLS_styleScopedClasses['role'];
        __VLS_styleScopedClasses['signature'];
        __VLS_styleScopedClasses['introduction'];
        __VLS_styleScopedClasses['articles-card'];
        __VLS_styleScopedClasses['card-header'];
        __VLS_styleScopedClasses['articles-list'];
        __VLS_styleScopedClasses['article-item'];
        __VLS_styleScopedClasses['article-title'];
        __VLS_styleScopedClasses['article-preview'];
        __VLS_styleScopedClasses['article-meta'];
        __VLS_styleScopedClasses['article-date'];
        __VLS_styleScopedClasses['no-articles'];
        __VLS_styleScopedClasses['pagination-container'];
        __VLS_styleScopedClasses['error-content'];
    }
    var __VLS_slots;
    return __VLS_slots;
    const __VLS_componentsOption = {};
    let __VLS_name;
    const __VLS_internalComponent = (await import('vue')).defineComponent({
        setup() {
            return {
                userData: userData,
                loading: loading,
                currentPage: currentPage,
                pageSize: pageSize,
                formatDate: formatDate,
                handleSizeChange: handleSizeChange,
                handleCurrentChange: handleCurrentChange,
                viewArticle: viewArticle,
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
