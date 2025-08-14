/* __placeholder__ */
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from 'element-plus';
import { Star } from '@element-plus/icons-vue';
import { useAuthStore } from '../store/auth';
import axios from "../axios";
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const article = ref(null);
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const likes = ref(0);
const comments = ref([]);
const newComment = ref('');
// 回复相关
const replyingTo = ref(null);
const replyContent = ref('');
const { id } = route.params;
const fetchArticle = async () => {
    try {
        const response = await axios.get(`/articles/${id}`);
        article.value = response.data;
    }
    catch (error) {
        console.error("Failed to load article:", error);
    }
};
const likeArticle = async () => {
    try {
        await axios.post(`/articles/${id}/like`);
        await fetchLike(); // 重新获取点赞数
        ElMessage.success('点赞成功！');
    }
    catch (error) {
        console.log('Error Liking article:', error);
        ElMessage.error('点赞失败');
    }
};
const fetchLike = async () => {
    try {
        const res = await axios.get(`/articles/${id}/like`);
        likes.value = res.data.likes;
    }
    catch (error) {
        console.log('Error fetching likes:', error);
    }
};
const fetchComments = async () => {
    try {
        const response = await axios.get(`/articles/${id}/comments`);
        const commentsData = response.data?.comments || [];
        // 处理评论层级结构
        const topLevelComments = commentsData.filter(comment => !comment.parent_id);
        const repliesMap = new Map();
        // 将回复按parent_id分组
        commentsData.filter(comment => comment.parent_id).forEach(reply => {
            if (!repliesMap.has(reply.parent_id)) {
                repliesMap.set(reply.parent_id, []);
            }
            repliesMap.get(reply.parent_id).push(reply);
        });
        // 为顶级评论添加回复
        topLevelComments.forEach(comment => {
            comment.replies = repliesMap.get(comment.id) || [];
        });
        comments.value = topLevelComments;
    }
    catch (error) {
        console.error('Failed to load comments:', error);
    }
};
const submitComment = async () => {
    if (!newComment.value.trim())
        return;
    try {
        const commentInput = {
            article_id: parseInt(id),
            content: newComment.value,
        };
        await axios.post('/comments', commentInput);
        newComment.value = '';
        await fetchComments();
        ElMessage.success('评论发表成功！');
    }
    catch (error) {
        console.error('Failed to submit comment:', error);
        ElMessage.error('评论发表失败');
    }
};
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-CN');
};
// 回复相关方法
const startReply = (comment) => {
    replyingTo.value = comment.id;
    replyContent.value = '';
};
const cancelReply = () => {
    replyingTo.value = null;
    replyContent.value = '';
};
const submitReply = async (parentId) => {
    if (!replyContent.value.trim())
        return;
    try {
        const replyInput = {
            article_id: parseInt(id),
            parent_id: parentId,
            content: replyContent.value,
        };
        await axios.post('/comments', replyInput);
        replyContent.value = '';
        replyingTo.value = null;
        await fetchComments();
        ElMessage.success('回复发表成功！');
    }
    catch (error) {
        console.error('Failed to submit reply:', error);
        ElMessage.error('回复发表失败');
    }
};
// 权限检查
const canDeleteComment = (comment) => {
    return authStore.userInfo?.role === 'admin' ||
        authStore.userInfo?.username === comment.username;
};
// 权限检查 - 只有管理员或文章作者可以删除文章
const canDeleteArticle = () => {
    return article.value && (authStore.userInfo?.role === 'admin' ||
        authStore.userInfo?.username === article.value.author);
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
    }
    catch (error) {
        if (error !== 'cancel') {
            console.error('Failed to delete article:', error);
            ElMessage.error('文章删除失败');
        }
    }
};
// 删除评论
const deleteComment = async (commentId) => {
    try {
        await ElMessageBox.confirm('确定要删除这条评论吗？', '确认删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        });
        await axios.delete(`/comments/${commentId}`);
        await fetchComments();
        ElMessage.success('评论删除成功！');
    }
    catch (error) {
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
    if (__VLS_ctx.article) {
        const __VLS_12 = {}.ElCard;
        ({}.ElCard);
        ({}.ElCard);
        __VLS_components.ElCard;
        __VLS_components.elCard;
        __VLS_components.ElCard;
        __VLS_components.elCard;
        // @ts-ignore
        [ElCard, ElCard,];
        const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({ ...{ class: ("article-detail") }, }));
        const __VLS_14 = __VLS_13({ ...{ class: ("article-detail") }, }, ...__VLS_functionalComponentArgsRest(__VLS_13));
        ({}({ ...{ class: ("article-detail") }, }));
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("article-header") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
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
        const __VLS_18 = {}.ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({ ...{ 'onClick': {} }, type: ("primary"), icon: ((__VLS_ctx.Star)), }));
        const __VLS_20 = __VLS_19({ ...{ 'onClick': {} }, type: ("primary"), icon: ((__VLS_ctx.Star)), }, ...__VLS_functionalComponentArgsRest(__VLS_19));
        ({}({ ...{ 'onClick': {} }, type: ("primary"), icon: ((__VLS_ctx.Star)), }));
        let __VLS_24;
        const __VLS_25 = {
            onClick: (__VLS_ctx.likeArticle)
        };
        (__VLS_ctx.likes);
        // @ts-ignore
        [Star, likeArticle, likes,];
        (__VLS_23.slots).default;
        const __VLS_23 = __VLS_pickFunctionalComponentCtx(__VLS_18, __VLS_20);
        let __VLS_21;
        let __VLS_22;
        if (__VLS_ctx.canDeleteArticle()) {
            const __VLS_26 = {}.ElButton;
            ({}.ElButton);
            ({}.ElButton);
            __VLS_components.ElButton;
            __VLS_components.elButton;
            __VLS_components.ElButton;
            __VLS_components.elButton;
            // @ts-ignore
            [ElButton, ElButton,];
            const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({ ...{ 'onClick': {} }, type: ("danger"), }));
            const __VLS_28 = __VLS_27({ ...{ 'onClick': {} }, type: ("danger"), }, ...__VLS_functionalComponentArgsRest(__VLS_27));
            ({}({ ...{ 'onClick': {} }, type: ("danger"), }));
            let __VLS_32;
            const __VLS_33 = {
                onClick: (__VLS_ctx.deleteArticle)
            };
            // @ts-ignore
            [canDeleteArticle, deleteArticle,];
            (__VLS_31.slots).default;
            const __VLS_31 = __VLS_pickFunctionalComponentCtx(__VLS_26, __VLS_28);
            let __VLS_29;
            let __VLS_30;
        }
        const __VLS_34 = {}.ElDivider;
        ({}.ElDivider);
        ({}.ElDivider);
        __VLS_components.ElDivider;
        __VLS_components.elDivider;
        __VLS_components.ElDivider;
        __VLS_components.elDivider;
        // @ts-ignore
        [ElDivider, ElDivider,];
        const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({}));
        const __VLS_36 = __VLS_35({}, ...__VLS_functionalComponentArgsRest(__VLS_35));
        ({}({}));
        (__VLS_39.slots).default;
        const __VLS_39 = __VLS_pickFunctionalComponentCtx(__VLS_34, __VLS_36);
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("comment-section") }, });
        const __VLS_40 = {}.ElForm;
        ({}.ElForm);
        ({}.ElForm);
        __VLS_components.ElForm;
        __VLS_components.elForm;
        __VLS_components.ElForm;
        __VLS_components.elForm;
        // @ts-ignore
        [ElForm, ElForm,];
        const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({ ...{ 'onSubmit': {} }, ...{ class: ("comment-form") }, }));
        const __VLS_42 = __VLS_41({ ...{ 'onSubmit': {} }, ...{ class: ("comment-form") }, }, ...__VLS_functionalComponentArgsRest(__VLS_41));
        ({}({ ...{ 'onSubmit': {} }, ...{ class: ("comment-form") }, }));
        let __VLS_46;
        const __VLS_47 = {
            onSubmit: (__VLS_ctx.submitComment)
        };
        const __VLS_48 = {}.ElInput;
        ({}.ElInput);
        __VLS_components.ElInput;
        __VLS_components.elInput;
        // @ts-ignore
        [ElInput,];
        const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({ modelValue: ((__VLS_ctx.newComment)), type: ("textarea"), rows: ((4)), placeholder: ("写下您的评论..."), maxlength: ("1000"), showWordLimit: (true), }));
        const __VLS_50 = __VLS_49({ modelValue: ((__VLS_ctx.newComment)), type: ("textarea"), rows: ((4)), placeholder: ("写下您的评论..."), maxlength: ("1000"), showWordLimit: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_49));
        ({}({ modelValue: ((__VLS_ctx.newComment)), type: ("textarea"), rows: ((4)), placeholder: ("写下您的评论..."), maxlength: ("1000"), showWordLimit: (true), }));
        // @ts-ignore
        [submitComment, newComment,];
        const __VLS_53 = __VLS_pickFunctionalComponentCtx(__VLS_48, __VLS_50);
        const __VLS_54 = {}.ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({ ...{ 'onClick': {} }, type: ("primary"), disabled: ((!__VLS_ctx.newComment.trim())), }));
        const __VLS_56 = __VLS_55({ ...{ 'onClick': {} }, type: ("primary"), disabled: ((!__VLS_ctx.newComment.trim())), }, ...__VLS_functionalComponentArgsRest(__VLS_55));
        ({}({ ...{ 'onClick': {} }, type: ("primary"), disabled: ((!__VLS_ctx.newComment.trim())), }));
        let __VLS_60;
        const __VLS_61 = {
            onClick: (__VLS_ctx.submitComment)
        };
        // @ts-ignore
        [submitComment, newComment,];
        (__VLS_59.slots).default;
        const __VLS_59 = __VLS_pickFunctionalComponentCtx(__VLS_54, __VLS_56);
        let __VLS_57;
        let __VLS_58;
        (__VLS_45.slots).default;
        const __VLS_45 = __VLS_pickFunctionalComponentCtx(__VLS_40, __VLS_42);
        let __VLS_43;
        let __VLS_44;
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("comments-list") }, });
        for (const [comment] of __VLS_getVForSourceType((__VLS_ctx.comments))) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ key: ((comment.id)), ...{ class: ("comment-item") }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("comment-header") }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("comment-author") }, });
            (comment.username);
            // @ts-ignore
            [comments,];
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("comment-date") }, });
            (__VLS_ctx.formatDate(comment.created_at));
            // @ts-ignore
            [formatDate,];
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("comment-actions") }, });
            const __VLS_62 = {}.ElButton;
            ({}.ElButton);
            ({}.ElButton);
            __VLS_components.ElButton;
            __VLS_components.elButton;
            __VLS_components.ElButton;
            __VLS_components.elButton;
            // @ts-ignore
            [ElButton, ElButton,];
            const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({ ...{ 'onClick': {} }, size: ("small"), type: ("text"), }));
            const __VLS_64 = __VLS_63({ ...{ 'onClick': {} }, size: ("small"), type: ("text"), }, ...__VLS_functionalComponentArgsRest(__VLS_63));
            ({}({ ...{ 'onClick': {} }, size: ("small"), type: ("text"), }));
            let __VLS_68;
            const __VLS_69 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.article)))
                        return;
                    __VLS_ctx.startReply(comment);
                    // @ts-ignore
                    [startReply,];
                }
            };
            (__VLS_67.slots).default;
            const __VLS_67 = __VLS_pickFunctionalComponentCtx(__VLS_62, __VLS_64);
            let __VLS_65;
            let __VLS_66;
            if (__VLS_ctx.canDeleteComment(comment)) {
                const __VLS_70 = {}.ElButton;
                ({}.ElButton);
                ({}.ElButton);
                __VLS_components.ElButton;
                __VLS_components.elButton;
                __VLS_components.ElButton;
                __VLS_components.elButton;
                // @ts-ignore
                [ElButton, ElButton,];
                const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({ ...{ 'onClick': {} }, size: ("small"), type: ("text"), ...{ class: ("delete-btn") }, }));
                const __VLS_72 = __VLS_71({ ...{ 'onClick': {} }, size: ("small"), type: ("text"), ...{ class: ("delete-btn") }, }, ...__VLS_functionalComponentArgsRest(__VLS_71));
                ({}({ ...{ 'onClick': {} }, size: ("small"), type: ("text"), ...{ class: ("delete-btn") }, }));
                let __VLS_76;
                const __VLS_77 = {
                    onClick: (...[$event]) => {
                        if (!((__VLS_ctx.article)))
                            return;
                        if (!((__VLS_ctx.canDeleteComment(comment))))
                            return;
                        __VLS_ctx.deleteComment(comment.id);
                        // @ts-ignore
                        [canDeleteComment, deleteComment,];
                    }
                };
                (__VLS_75.slots).default;
                const __VLS_75 = __VLS_pickFunctionalComponentCtx(__VLS_70, __VLS_72);
                let __VLS_73;
                let __VLS_74;
            }
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("comment-content") }, });
            (comment.content);
            if (__VLS_ctx.replyingTo === comment.id) {
                __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("reply-form") }, });
                const __VLS_78 = {}.ElInput;
                ({}.ElInput);
                __VLS_components.ElInput;
                __VLS_components.elInput;
                // @ts-ignore
                [ElInput,];
                const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({ modelValue: ((__VLS_ctx.replyContent)), type: ("textarea"), rows: ((2)), placeholder: ("写下您的回复..."), maxlength: ("500"), showWordLimit: (true), }));
                const __VLS_80 = __VLS_79({ modelValue: ((__VLS_ctx.replyContent)), type: ("textarea"), rows: ((2)), placeholder: ("写下您的回复..."), maxlength: ("500"), showWordLimit: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_79));
                ({}({ modelValue: ((__VLS_ctx.replyContent)), type: ("textarea"), rows: ((2)), placeholder: ("写下您的回复..."), maxlength: ("500"), showWordLimit: (true), }));
                // @ts-ignore
                [replyingTo, replyContent,];
                const __VLS_83 = __VLS_pickFunctionalComponentCtx(__VLS_78, __VLS_80);
                __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("reply-actions") }, });
                const __VLS_84 = {}.ElButton;
                ({}.ElButton);
                ({}.ElButton);
                __VLS_components.ElButton;
                __VLS_components.elButton;
                __VLS_components.ElButton;
                __VLS_components.elButton;
                // @ts-ignore
                [ElButton, ElButton,];
                const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({ ...{ 'onClick': {} }, size: ("small"), }));
                const __VLS_86 = __VLS_85({ ...{ 'onClick': {} }, size: ("small"), }, ...__VLS_functionalComponentArgsRest(__VLS_85));
                ({}({ ...{ 'onClick': {} }, size: ("small"), }));
                let __VLS_90;
                const __VLS_91 = {
                    onClick: (__VLS_ctx.cancelReply)
                };
                // @ts-ignore
                [cancelReply,];
                (__VLS_89.slots).default;
                const __VLS_89 = __VLS_pickFunctionalComponentCtx(__VLS_84, __VLS_86);
                let __VLS_87;
                let __VLS_88;
                const __VLS_92 = {}.ElButton;
                ({}.ElButton);
                ({}.ElButton);
                __VLS_components.ElButton;
                __VLS_components.elButton;
                __VLS_components.ElButton;
                __VLS_components.elButton;
                // @ts-ignore
                [ElButton, ElButton,];
                const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({ ...{ 'onClick': {} }, size: ("small"), type: ("primary"), }));
                const __VLS_94 = __VLS_93({ ...{ 'onClick': {} }, size: ("small"), type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_93));
                ({}({ ...{ 'onClick': {} }, size: ("small"), type: ("primary"), }));
                let __VLS_98;
                const __VLS_99 = {
                    onClick: (...[$event]) => {
                        if (!((__VLS_ctx.article)))
                            return;
                        if (!((__VLS_ctx.replyingTo === comment.id)))
                            return;
                        __VLS_ctx.submitReply(comment.id);
                        // @ts-ignore
                        [submitReply,];
                    }
                };
                (__VLS_97.slots).default;
                const __VLS_97 = __VLS_pickFunctionalComponentCtx(__VLS_92, __VLS_94);
                let __VLS_95;
                let __VLS_96;
            }
            if (comment.replies && comment.replies.length) {
                __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("replies") }, });
                for (const [reply] of __VLS_getVForSourceType((comment.replies))) {
                    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ key: ((reply.id)), ...{ class: ("reply-item") }, });
                    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("reply-header") }, });
                    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("reply-author") }, });
                    (reply.username);
                    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("reply-date") }, });
                    (__VLS_ctx.formatDate(reply.created_at));
                    // @ts-ignore
                    [formatDate,];
                    if (__VLS_ctx.canDeleteComment(reply)) {
                        const __VLS_100 = {}.ElButton;
                        ({}.ElButton);
                        ({}.ElButton);
                        __VLS_components.ElButton;
                        __VLS_components.elButton;
                        __VLS_components.ElButton;
                        __VLS_components.elButton;
                        // @ts-ignore
                        [ElButton, ElButton,];
                        const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({ ...{ 'onClick': {} }, size: ("small"), type: ("text"), ...{ class: ("delete-btn") }, }));
                        const __VLS_102 = __VLS_101({ ...{ 'onClick': {} }, size: ("small"), type: ("text"), ...{ class: ("delete-btn") }, }, ...__VLS_functionalComponentArgsRest(__VLS_101));
                        ({}({ ...{ 'onClick': {} }, size: ("small"), type: ("text"), ...{ class: ("delete-btn") }, }));
                        let __VLS_106;
                        const __VLS_107 = {
                            onClick: (...[$event]) => {
                                if (!((__VLS_ctx.article)))
                                    return;
                                if (!((comment.replies && comment.replies.length)))
                                    return;
                                if (!((__VLS_ctx.canDeleteComment(reply))))
                                    return;
                                __VLS_ctx.deleteComment(reply.id);
                                // @ts-ignore
                                [canDeleteComment, deleteComment,];
                            }
                        };
                        (__VLS_105.slots).default;
                        const __VLS_105 = __VLS_pickFunctionalComponentCtx(__VLS_100, __VLS_102);
                        let __VLS_103;
                        let __VLS_104;
                    }
                    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("reply-content") }, });
                    (reply.content);
                }
            }
        }
        if (!__VLS_ctx.comments.length) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("no-comments") }, });
            // @ts-ignore
            [comments,];
        }
        (__VLS_17.slots).default;
        const __VLS_17 = __VLS_pickFunctionalComponentCtx(__VLS_12, __VLS_14);
    }
    else {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("no-data") }, });
    }
    (__VLS_11.slots).default;
    const __VLS_11 = __VLS_pickFunctionalComponentCtx(__VLS_6, __VLS_8);
    (__VLS_5.slots).default;
    const __VLS_5 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2);
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses['article-detail'];
        __VLS_styleScopedClasses['article-header'];
        __VLS_styleScopedClasses['article-meta'];
        __VLS_styleScopedClasses['author'];
        __VLS_styleScopedClasses['date'];
        __VLS_styleScopedClasses['article-content'];
        __VLS_styleScopedClasses['article-actions'];
        __VLS_styleScopedClasses['comment-section'];
        __VLS_styleScopedClasses['comment-form'];
        __VLS_styleScopedClasses['comments-list'];
        __VLS_styleScopedClasses['comment-item'];
        __VLS_styleScopedClasses['comment-header'];
        __VLS_styleScopedClasses['comment-author'];
        __VLS_styleScopedClasses['comment-date'];
        __VLS_styleScopedClasses['comment-actions'];
        __VLS_styleScopedClasses['delete-btn'];
        __VLS_styleScopedClasses['comment-content'];
        __VLS_styleScopedClasses['reply-form'];
        __VLS_styleScopedClasses['reply-actions'];
        __VLS_styleScopedClasses['replies'];
        __VLS_styleScopedClasses['reply-item'];
        __VLS_styleScopedClasses['reply-header'];
        __VLS_styleScopedClasses['reply-author'];
        __VLS_styleScopedClasses['reply-date'];
        __VLS_styleScopedClasses['delete-btn'];
        __VLS_styleScopedClasses['reply-content'];
        __VLS_styleScopedClasses['no-comments'];
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
                comments: comments,
                newComment: newComment,
                replyingTo: replyingTo,
                replyContent: replyContent,
                likeArticle: likeArticle,
                submitComment: submitComment,
                formatDate: formatDate,
                startReply: startReply,
                cancelReply: cancelReply,
                submitReply: submitReply,
                canDeleteComment: canDeleteComment,
                canDeleteArticle: canDeleteArticle,
                deleteArticle: deleteArticle,
                deleteComment: deleteComment,
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
