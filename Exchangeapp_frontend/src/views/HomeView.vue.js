/* __placeholder__ */
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import { Money, Reading, Wallet, User } from '@element-plus/icons-vue';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const router = useRouter();
const authStore = useAuthStore();
const goTo = (routeName) => {
    router.push({ name: routeName });
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
    const __VLS_0 = {}.ElContainer;
    ({}.ElContainer);
    ({}.ElContainer);
    __VLS_components.ElContainer;
    __VLS_components.elContainer;
    __VLS_components.ElContainer;
    __VLS_components.elContainer;
    // @ts-ignore
    [ElContainer, ElContainer,];
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ...{ class: ("home-container") }, }));
    const __VLS_2 = __VLS_1({ ...{ class: ("home-container") }, }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    ({}({ ...{ class: ("home-container") }, }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("content-wrapper") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({ ...{ class: ("title") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("description") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("feature-cards") }, });
    const __VLS_6 = {}.ElCard;
    ({}.ElCard);
    ({}.ElCard);
    __VLS_components.ElCard;
    __VLS_components.elCard;
    __VLS_components.ElCard;
    __VLS_components.elCard;
    // @ts-ignore
    [ElCard, ElCard,];
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({ ...{ class: ("feature-card") }, shadow: ("hover"), }));
    const __VLS_8 = __VLS_7({ ...{ class: ("feature-card") }, shadow: ("hover"), }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    ({}({ ...{ class: ("feature-card") }, shadow: ("hover"), }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("card-content") }, });
    const __VLS_12 = {}.ElIcon;
    ({}.ElIcon);
    ({}.ElIcon);
    __VLS_components.ElIcon;
    __VLS_components.elIcon;
    __VLS_components.ElIcon;
    __VLS_components.elIcon;
    // @ts-ignore
    [ElIcon, ElIcon,];
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({ ...{ class: ("card-icon") }, }));
    const __VLS_14 = __VLS_13({ ...{ class: ("card-icon") }, }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    ({}({ ...{ class: ("card-icon") }, }));
    const __VLS_18 = {}.Money;
    ({}.Money);
    __VLS_components.Money;
    // @ts-ignore
    [Money,];
    const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({}));
    const __VLS_20 = __VLS_19({}, ...__VLS_functionalComponentArgsRest(__VLS_19));
    ({}({}));
    const __VLS_23 = __VLS_pickFunctionalComponentCtx(__VLS_18, __VLS_20);
    (__VLS_17.slots).default;
    const __VLS_17 = __VLS_pickFunctionalComponentCtx(__VLS_12, __VLS_14);
    __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    const __VLS_24 = {}.ElButton;
    ({}.ElButton);
    ({}.ElButton);
    __VLS_components.ElButton;
    __VLS_components.elButton;
    __VLS_components.ElButton;
    __VLS_components.elButton;
    // @ts-ignore
    [ElButton, ElButton,];
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({ ...{ 'onClick': {} }, type: ("primary"), }));
    const __VLS_26 = __VLS_25({ ...{ 'onClick': {} }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    ({}({ ...{ 'onClick': {} }, type: ("primary"), }));
    let __VLS_30;
    const __VLS_31 = {
        onClick: (...[$event]) => {
            __VLS_ctx.goTo('CurrencyExchange');
            // @ts-ignore
            [goTo,];
        }
    };
    (__VLS_29.slots).default;
    const __VLS_29 = __VLS_pickFunctionalComponentCtx(__VLS_24, __VLS_26);
    let __VLS_27;
    let __VLS_28;
    (__VLS_11.slots).default;
    const __VLS_11 = __VLS_pickFunctionalComponentCtx(__VLS_6, __VLS_8);
    const __VLS_32 = {}.ElCard;
    ({}.ElCard);
    ({}.ElCard);
    __VLS_components.ElCard;
    __VLS_components.elCard;
    __VLS_components.ElCard;
    __VLS_components.elCard;
    // @ts-ignore
    [ElCard, ElCard,];
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({ ...{ class: ("feature-card") }, shadow: ("hover"), }));
    const __VLS_34 = __VLS_33({ ...{ class: ("feature-card") }, shadow: ("hover"), }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    ({}({ ...{ class: ("feature-card") }, shadow: ("hover"), }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("card-content") }, });
    const __VLS_38 = {}.ElIcon;
    ({}.ElIcon);
    ({}.ElIcon);
    __VLS_components.ElIcon;
    __VLS_components.elIcon;
    __VLS_components.ElIcon;
    __VLS_components.elIcon;
    // @ts-ignore
    [ElIcon, ElIcon,];
    const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({ ...{ class: ("card-icon") }, }));
    const __VLS_40 = __VLS_39({ ...{ class: ("card-icon") }, }, ...__VLS_functionalComponentArgsRest(__VLS_39));
    ({}({ ...{ class: ("card-icon") }, }));
    const __VLS_44 = {}.Reading;
    ({}.Reading);
    __VLS_components.Reading;
    // @ts-ignore
    [Reading,];
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({}));
    const __VLS_46 = __VLS_45({}, ...__VLS_functionalComponentArgsRest(__VLS_45));
    ({}({}));
    const __VLS_49 = __VLS_pickFunctionalComponentCtx(__VLS_44, __VLS_46);
    (__VLS_43.slots).default;
    const __VLS_43 = __VLS_pickFunctionalComponentCtx(__VLS_38, __VLS_40);
    __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    const __VLS_50 = {}.ElButton;
    ({}.ElButton);
    ({}.ElButton);
    __VLS_components.ElButton;
    __VLS_components.elButton;
    __VLS_components.ElButton;
    __VLS_components.elButton;
    // @ts-ignore
    [ElButton, ElButton,];
    const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({ ...{ 'onClick': {} }, type: ("primary"), }));
    const __VLS_52 = __VLS_51({ ...{ 'onClick': {} }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    ({}({ ...{ 'onClick': {} }, type: ("primary"), }));
    let __VLS_56;
    const __VLS_57 = {
        onClick: (...[$event]) => {
            __VLS_ctx.goTo('News');
            // @ts-ignore
            [goTo,];
        }
    };
    (__VLS_55.slots).default;
    const __VLS_55 = __VLS_pickFunctionalComponentCtx(__VLS_50, __VLS_52);
    let __VLS_53;
    let __VLS_54;
    (__VLS_37.slots).default;
    const __VLS_37 = __VLS_pickFunctionalComponentCtx(__VLS_32, __VLS_34);
    if (__VLS_ctx.authStore.isAuthenticated) {
        const __VLS_58 = {}.ElCard;
        ({}.ElCard);
        ({}.ElCard);
        __VLS_components.ElCard;
        __VLS_components.elCard;
        __VLS_components.ElCard;
        __VLS_components.elCard;
        // @ts-ignore
        [ElCard, ElCard,];
        const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({ ...{ class: ("feature-card") }, shadow: ("hover"), }));
        const __VLS_60 = __VLS_59({ ...{ class: ("feature-card") }, shadow: ("hover"), }, ...__VLS_functionalComponentArgsRest(__VLS_59));
        ({}({ ...{ class: ("feature-card") }, shadow: ("hover"), }));
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("card-content") }, });
        const __VLS_64 = {}.ElIcon;
        ({}.ElIcon);
        ({}.ElIcon);
        __VLS_components.ElIcon;
        __VLS_components.elIcon;
        __VLS_components.ElIcon;
        __VLS_components.elIcon;
        // @ts-ignore
        [ElIcon, ElIcon,];
        const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({ ...{ class: ("card-icon") }, }));
        const __VLS_66 = __VLS_65({ ...{ class: ("card-icon") }, }, ...__VLS_functionalComponentArgsRest(__VLS_65));
        ({}({ ...{ class: ("card-icon") }, }));
        const __VLS_70 = {}.Wallet;
        ({}.Wallet);
        __VLS_components.Wallet;
        // @ts-ignore
        [Wallet,];
        const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({}));
        const __VLS_72 = __VLS_71({}, ...__VLS_functionalComponentArgsRest(__VLS_71));
        ({}({}));
        // @ts-ignore
        [authStore,];
        const __VLS_75 = __VLS_pickFunctionalComponentCtx(__VLS_70, __VLS_72);
        (__VLS_69.slots).default;
        const __VLS_69 = __VLS_pickFunctionalComponentCtx(__VLS_64, __VLS_66);
        __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        const __VLS_76 = {}.ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({ ...{ 'onClick': {} }, type: ("primary"), }));
        const __VLS_78 = __VLS_77({ ...{ 'onClick': {} }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_77));
        ({}({ ...{ 'onClick': {} }, type: ("primary"), }));
        let __VLS_82;
        const __VLS_83 = {
            onClick: (...[$event]) => {
                if (!((__VLS_ctx.authStore.isAuthenticated)))
                    return;
                __VLS_ctx.goTo('Wallet');
                // @ts-ignore
                [goTo,];
            }
        };
        (__VLS_81.slots).default;
        const __VLS_81 = __VLS_pickFunctionalComponentCtx(__VLS_76, __VLS_78);
        let __VLS_79;
        let __VLS_80;
        (__VLS_63.slots).default;
        const __VLS_63 = __VLS_pickFunctionalComponentCtx(__VLS_58, __VLS_60);
    }
    if (!__VLS_ctx.authStore.isAuthenticated) {
        const __VLS_84 = {}.ElCard;
        ({}.ElCard);
        ({}.ElCard);
        __VLS_components.ElCard;
        __VLS_components.elCard;
        __VLS_components.ElCard;
        __VLS_components.elCard;
        // @ts-ignore
        [ElCard, ElCard,];
        const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({ ...{ class: ("feature-card") }, shadow: ("hover"), }));
        const __VLS_86 = __VLS_85({ ...{ class: ("feature-card") }, shadow: ("hover"), }, ...__VLS_functionalComponentArgsRest(__VLS_85));
        ({}({ ...{ class: ("feature-card") }, shadow: ("hover"), }));
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("card-content") }, });
        const __VLS_90 = {}.ElIcon;
        ({}.ElIcon);
        ({}.ElIcon);
        __VLS_components.ElIcon;
        __VLS_components.elIcon;
        __VLS_components.ElIcon;
        __VLS_components.elIcon;
        // @ts-ignore
        [ElIcon, ElIcon,];
        const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({ ...{ class: ("card-icon") }, }));
        const __VLS_92 = __VLS_91({ ...{ class: ("card-icon") }, }, ...__VLS_functionalComponentArgsRest(__VLS_91));
        ({}({ ...{ class: ("card-icon") }, }));
        const __VLS_96 = {}.User;
        ({}.User);
        __VLS_components.User;
        // @ts-ignore
        [User,];
        const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({}));
        const __VLS_98 = __VLS_97({}, ...__VLS_functionalComponentArgsRest(__VLS_97));
        ({}({}));
        // @ts-ignore
        [authStore,];
        const __VLS_101 = __VLS_pickFunctionalComponentCtx(__VLS_96, __VLS_98);
        (__VLS_95.slots).default;
        const __VLS_95 = __VLS_pickFunctionalComponentCtx(__VLS_90, __VLS_92);
        __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        const __VLS_102 = {}.ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({ ...{ 'onClick': {} }, type: ("primary"), }));
        const __VLS_104 = __VLS_103({ ...{ 'onClick': {} }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_103));
        ({}({ ...{ 'onClick': {} }, type: ("primary"), }));
        let __VLS_108;
        const __VLS_109 = {
            onClick: (...[$event]) => {
                if (!((!__VLS_ctx.authStore.isAuthenticated)))
                    return;
                __VLS_ctx.goTo('Register');
                // @ts-ignore
                [goTo,];
            }
        };
        (__VLS_107.slots).default;
        const __VLS_107 = __VLS_pickFunctionalComponentCtx(__VLS_102, __VLS_104);
        let __VLS_105;
        let __VLS_106;
        (__VLS_89.slots).default;
        const __VLS_89 = __VLS_pickFunctionalComponentCtx(__VLS_84, __VLS_86);
    }
    (__VLS_5.slots).default;
    const __VLS_5 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2);
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses['home-container'];
        __VLS_styleScopedClasses['content-wrapper'];
        __VLS_styleScopedClasses['title'];
        __VLS_styleScopedClasses['description'];
        __VLS_styleScopedClasses['feature-cards'];
        __VLS_styleScopedClasses['feature-card'];
        __VLS_styleScopedClasses['card-content'];
        __VLS_styleScopedClasses['card-icon'];
        __VLS_styleScopedClasses['feature-card'];
        __VLS_styleScopedClasses['card-content'];
        __VLS_styleScopedClasses['card-icon'];
        __VLS_styleScopedClasses['feature-card'];
        __VLS_styleScopedClasses['card-content'];
        __VLS_styleScopedClasses['card-icon'];
        __VLS_styleScopedClasses['feature-card'];
        __VLS_styleScopedClasses['card-content'];
        __VLS_styleScopedClasses['card-icon'];
    }
    var __VLS_slots;
    return __VLS_slots;
    const __VLS_componentsOption = {};
    let __VLS_name;
    const __VLS_internalComponent = (await import('vue')).defineComponent({
        setup() {
            return {
                Money: Money,
                Reading: Reading,
                Wallet: Wallet,
                User: User,
                authStore: authStore,
                goTo: goTo,
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
