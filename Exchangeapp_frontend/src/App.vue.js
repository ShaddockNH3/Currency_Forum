/* __placeholder__ */
import { useAuthStore } from './store/auth';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { ArrowDown } from '@element-plus/icons-vue';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const authStore = useAuthStore();
const router = useRouter();
const handleCommand = (command) => {
    switch (command) {
        case 'profile':
            // 跳转到个人资料页面
            router.push(`/users/${authStore.username}`);
            break;
        case 'logout':
            authStore.logout();
            ElMessage.success('已退出登录');
            router.push('/');
            break;
    }
};
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
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ id: ("app"), });
    const __VLS_0 = {}.ElHeader;
    ({}.ElHeader);
    ({}.ElHeader);
    __VLS_components.ElHeader;
    __VLS_components.elHeader;
    __VLS_components.ElHeader;
    __VLS_components.elHeader;
    // @ts-ignore
    [ElHeader, ElHeader,];
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ...{ class: ("app-header") }, }));
    const __VLS_2 = __VLS_1({ ...{ class: ("app-header") }, }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    ({}({ ...{ class: ("app-header") }, }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("header-content") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ onClick: (...[$event]) => {
                __VLS_ctx.$router.push('/');
                // @ts-ignore
                [$router,];
            } }, ...{ class: ("logo") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)({ ...{ class: ("nav-links") }, });
    const __VLS_6 = {}.ElButton;
    ({}.ElButton);
    ({}.ElButton);
    __VLS_components.ElButton;
    __VLS_components.elButton;
    __VLS_components.ElButton;
    __VLS_components.elButton;
    // @ts-ignore
    [ElButton, ElButton,];
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({ ...{ 'onClick': {} }, text: (true), }));
    const __VLS_8 = __VLS_7({ ...{ 'onClick': {} }, text: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    ({}({ ...{ 'onClick': {} }, text: (true), }));
    let __VLS_12;
    const __VLS_13 = {
        onClick: (...[$event]) => {
            __VLS_ctx.$router.push('/');
            // @ts-ignore
            [$router,];
        }
    };
    (__VLS_11.slots).default;
    const __VLS_11 = __VLS_pickFunctionalComponentCtx(__VLS_6, __VLS_8);
    let __VLS_9;
    let __VLS_10;
    const __VLS_14 = {}.ElButton;
    ({}.ElButton);
    ({}.ElButton);
    __VLS_components.ElButton;
    __VLS_components.elButton;
    __VLS_components.ElButton;
    __VLS_components.elButton;
    // @ts-ignore
    [ElButton, ElButton,];
    const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({ ...{ 'onClick': {} }, text: (true), }));
    const __VLS_16 = __VLS_15({ ...{ 'onClick': {} }, text: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    ({}({ ...{ 'onClick': {} }, text: (true), }));
    let __VLS_20;
    const __VLS_21 = {
        onClick: (...[$event]) => {
            __VLS_ctx.$router.push('/exchange');
            // @ts-ignore
            [$router,];
        }
    };
    (__VLS_19.slots).default;
    const __VLS_19 = __VLS_pickFunctionalComponentCtx(__VLS_14, __VLS_16);
    let __VLS_17;
    let __VLS_18;
    const __VLS_22 = {}.ElButton;
    ({}.ElButton);
    ({}.ElButton);
    __VLS_components.ElButton;
    __VLS_components.elButton;
    __VLS_components.ElButton;
    __VLS_components.elButton;
    // @ts-ignore
    [ElButton, ElButton,];
    const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({ ...{ 'onClick': {} }, text: (true), }));
    const __VLS_24 = __VLS_23({ ...{ 'onClick': {} }, text: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_23));
    ({}({ ...{ 'onClick': {} }, text: (true), }));
    let __VLS_28;
    const __VLS_29 = {
        onClick: (...[$event]) => {
            __VLS_ctx.$router.push('/news');
            // @ts-ignore
            [$router,];
        }
    };
    (__VLS_27.slots).default;
    const __VLS_27 = __VLS_pickFunctionalComponentCtx(__VLS_22, __VLS_24);
    let __VLS_25;
    let __VLS_26;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("auth-section") }, });
    if (__VLS_ctx.authStore.isAuthenticated) {
        const __VLS_30 = {}.ElDropdown;
        ({}.ElDropdown);
        ({}.ElDropdown);
        __VLS_components.ElDropdown;
        __VLS_components.elDropdown;
        __VLS_components.ElDropdown;
        __VLS_components.elDropdown;
        // @ts-ignore
        [ElDropdown, ElDropdown,];
        const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({ ...{ 'onCommand': {} }, }));
        const __VLS_32 = __VLS_31({ ...{ 'onCommand': {} }, }, ...__VLS_functionalComponentArgsRest(__VLS_31));
        ({}({ ...{ 'onCommand': {} }, }));
        let __VLS_36;
        const __VLS_37 = {
            onCommand: (__VLS_ctx.handleCommand)
        };
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("user-info") }, });
        const __VLS_38 = {}.ElAvatar;
        ({}.ElAvatar);
        __VLS_components.ElAvatar;
        __VLS_components.elAvatar;
        // @ts-ignore
        [ElAvatar,];
        const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({ size: ((32)), icon: ("UserFilled"), }));
        const __VLS_40 = __VLS_39({ size: ((32)), icon: ("UserFilled"), }, ...__VLS_functionalComponentArgsRest(__VLS_39));
        ({}({ size: ((32)), icon: ("UserFilled"), }));
        // @ts-ignore
        [authStore, handleCommand,];
        const __VLS_43 = __VLS_pickFunctionalComponentCtx(__VLS_38, __VLS_40);
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("username") }, });
        (__VLS_ctx.authStore.username || '用户');
        // @ts-ignore
        [authStore,];
        const __VLS_44 = {}.ElIcon;
        ({}.ElIcon);
        ({}.ElIcon);
        __VLS_components.ElIcon;
        __VLS_components.elIcon;
        __VLS_components.ElIcon;
        __VLS_components.elIcon;
        // @ts-ignore
        [ElIcon, ElIcon,];
        const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({}));
        const __VLS_46 = __VLS_45({}, ...__VLS_functionalComponentArgsRest(__VLS_45));
        ({}({}));
        const __VLS_50 = {}.ArrowDown;
        ({}.ArrowDown);
        __VLS_components.ArrowDown;
        // @ts-ignore
        [ArrowDown,];
        const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({}));
        const __VLS_52 = __VLS_51({}, ...__VLS_functionalComponentArgsRest(__VLS_51));
        ({}({}));
        const __VLS_55 = __VLS_pickFunctionalComponentCtx(__VLS_50, __VLS_52);
        (__VLS_49.slots).default;
        const __VLS_49 = __VLS_pickFunctionalComponentCtx(__VLS_44, __VLS_46);
        __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
        {
            (__VLS_35.slots).dropdown;
            const __VLS_56 = {}.ElDropdownMenu;
            ({}.ElDropdownMenu);
            ({}.ElDropdownMenu);
            __VLS_components.ElDropdownMenu;
            __VLS_components.elDropdownMenu;
            __VLS_components.ElDropdownMenu;
            __VLS_components.elDropdownMenu;
            // @ts-ignore
            [ElDropdownMenu, ElDropdownMenu,];
            const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({}));
            const __VLS_58 = __VLS_57({}, ...__VLS_functionalComponentArgsRest(__VLS_57));
            ({}({}));
            const __VLS_62 = {}.ElDropdownItem;
            ({}.ElDropdownItem);
            ({}.ElDropdownItem);
            __VLS_components.ElDropdownItem;
            __VLS_components.elDropdownItem;
            __VLS_components.ElDropdownItem;
            __VLS_components.elDropdownItem;
            // @ts-ignore
            [ElDropdownItem, ElDropdownItem,];
            const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({ command: ("profile"), }));
            const __VLS_64 = __VLS_63({ command: ("profile"), }, ...__VLS_functionalComponentArgsRest(__VLS_63));
            ({}({ command: ("profile"), }));
            (__VLS_67.slots).default;
            const __VLS_67 = __VLS_pickFunctionalComponentCtx(__VLS_62, __VLS_64);
            const __VLS_68 = {}.ElDropdownItem;
            ({}.ElDropdownItem);
            ({}.ElDropdownItem);
            __VLS_components.ElDropdownItem;
            __VLS_components.elDropdownItem;
            __VLS_components.ElDropdownItem;
            __VLS_components.elDropdownItem;
            // @ts-ignore
            [ElDropdownItem, ElDropdownItem,];
            const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({ command: ("logout"), divided: (true), }));
            const __VLS_70 = __VLS_69({ command: ("logout"), divided: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_69));
            ({}({ command: ("logout"), divided: (true), }));
            (__VLS_73.slots).default;
            const __VLS_73 = __VLS_pickFunctionalComponentCtx(__VLS_68, __VLS_70);
            (__VLS_61.slots).default;
            const __VLS_61 = __VLS_pickFunctionalComponentCtx(__VLS_56, __VLS_58);
        }
        const __VLS_35 = __VLS_pickFunctionalComponentCtx(__VLS_30, __VLS_32);
        let __VLS_33;
        let __VLS_34;
    }
    else {
        const __VLS_74 = {}.ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({ ...{ 'onClick': {} }, text: (true), }));
        const __VLS_76 = __VLS_75({ ...{ 'onClick': {} }, text: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_75));
        ({}({ ...{ 'onClick': {} }, text: (true), }));
        let __VLS_80;
        const __VLS_81 = {
            onClick: (...[$event]) => {
                if (!(!((__VLS_ctx.authStore.isAuthenticated))))
                    return;
                __VLS_ctx.$router.push('/login');
                // @ts-ignore
                [$router,];
            }
        };
        (__VLS_79.slots).default;
        const __VLS_79 = __VLS_pickFunctionalComponentCtx(__VLS_74, __VLS_76);
        let __VLS_77;
        let __VLS_78;
        const __VLS_82 = {}.ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({ ...{ 'onClick': {} }, type: ("primary"), }));
        const __VLS_84 = __VLS_83({ ...{ 'onClick': {} }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_83));
        ({}({ ...{ 'onClick': {} }, type: ("primary"), }));
        let __VLS_88;
        const __VLS_89 = {
            onClick: (...[$event]) => {
                if (!(!((__VLS_ctx.authStore.isAuthenticated))))
                    return;
                __VLS_ctx.$router.push('/register');
                // @ts-ignore
                [$router,];
            }
        };
        (__VLS_87.slots).default;
        const __VLS_87 = __VLS_pickFunctionalComponentCtx(__VLS_82, __VLS_84);
        let __VLS_85;
        let __VLS_86;
    }
    (__VLS_5.slots).default;
    const __VLS_5 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2);
    const __VLS_90 = {}.ElMain;
    ({}.ElMain);
    ({}.ElMain);
    __VLS_components.ElMain;
    __VLS_components.elMain;
    __VLS_components.ElMain;
    __VLS_components.elMain;
    // @ts-ignore
    [ElMain, ElMain,];
    const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({ ...{ class: ("app-main") }, }));
    const __VLS_92 = __VLS_91({ ...{ class: ("app-main") }, }, ...__VLS_functionalComponentArgsRest(__VLS_91));
    ({}({ ...{ class: ("app-main") }, }));
    const __VLS_96 = {}.RouterView;
    ({}.RouterView);
    __VLS_components.RouterView;
    __VLS_components.routerView;
    // @ts-ignore
    [RouterView,];
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({}));
    const __VLS_98 = __VLS_97({}, ...__VLS_functionalComponentArgsRest(__VLS_97));
    ({}({}));
    const __VLS_101 = __VLS_pickFunctionalComponentCtx(__VLS_96, __VLS_98);
    (__VLS_95.slots).default;
    const __VLS_95 = __VLS_pickFunctionalComponentCtx(__VLS_90, __VLS_92);
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses['app-header'];
        __VLS_styleScopedClasses['header-content'];
        __VLS_styleScopedClasses['logo'];
        __VLS_styleScopedClasses['nav-links'];
        __VLS_styleScopedClasses['auth-section'];
        __VLS_styleScopedClasses['user-info'];
        __VLS_styleScopedClasses['username'];
        __VLS_styleScopedClasses['app-main'];
    }
    var __VLS_slots;
    return __VLS_slots;
    const __VLS_componentsOption = {};
    let __VLS_name;
    const __VLS_internalComponent = (await import('vue')).defineComponent({
        setup() {
            return {
                ArrowDown: ArrowDown,
                authStore: authStore,
                handleCommand: handleCommand,
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
