/* __placeholder__ */
import { useRouter } from 'vue-router';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const router = useRouter();
const navigateTo = (path) => {
    router.push(path);
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
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("feature-grid") }, });
    const __VLS_6 = {}.ElCard;
    ({}.ElCard);
    ({}.ElCard);
    __VLS_components.ElCard;
    __VLS_components.elCard;
    __VLS_components.ElCard;
    __VLS_components.elCard;
    // @ts-ignore
    [ElCard, ElCard,];
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({ ...{ 'onClick': {} }, ...{ class: ("feature-card") }, }));
    const __VLS_8 = __VLS_7({ ...{ 'onClick': {} }, ...{ class: ("feature-card") }, }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    ({}({ ...{ 'onClick': {} }, ...{ class: ("feature-card") }, }));
    let __VLS_12;
    const __VLS_13 = {
        onClick: (...[$event]) => {
            __VLS_ctx.navigateTo('/exchange');
            // @ts-ignore
            [navigateTo,];
        }
    };
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("feature-icon") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_11.slots).default;
    const __VLS_11 = __VLS_pickFunctionalComponentCtx(__VLS_6, __VLS_8);
    let __VLS_9;
    let __VLS_10;
    const __VLS_14 = {}.ElCard;
    ({}.ElCard);
    ({}.ElCard);
    __VLS_components.ElCard;
    __VLS_components.elCard;
    __VLS_components.ElCard;
    __VLS_components.elCard;
    // @ts-ignore
    [ElCard, ElCard,];
    const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({ ...{ 'onClick': {} }, ...{ class: ("feature-card") }, }));
    const __VLS_16 = __VLS_15({ ...{ 'onClick': {} }, ...{ class: ("feature-card") }, }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    ({}({ ...{ 'onClick': {} }, ...{ class: ("feature-card") }, }));
    let __VLS_20;
    const __VLS_21 = {
        onClick: (...[$event]) => {
            __VLS_ctx.navigateTo('/news');
            // @ts-ignore
            [navigateTo,];
        }
    };
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("feature-icon") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_19.slots).default;
    const __VLS_19 = __VLS_pickFunctionalComponentCtx(__VLS_14, __VLS_16);
    let __VLS_17;
    let __VLS_18;
    const __VLS_22 = {}.ElCard;
    ({}.ElCard);
    ({}.ElCard);
    __VLS_components.ElCard;
    __VLS_components.elCard;
    __VLS_components.ElCard;
    __VLS_components.elCard;
    // @ts-ignore
    [ElCard, ElCard,];
    const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({ ...{ 'onClick': {} }, ...{ class: ("feature-card") }, }));
    const __VLS_24 = __VLS_23({ ...{ 'onClick': {} }, ...{ class: ("feature-card") }, }, ...__VLS_functionalComponentArgsRest(__VLS_23));
    ({}({ ...{ 'onClick': {} }, ...{ class: ("feature-card") }, }));
    let __VLS_28;
    const __VLS_29 = {
        onClick: (...[$event]) => {
            __VLS_ctx.navigateTo('/login');
            // @ts-ignore
            [navigateTo,];
        }
    };
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("feature-icon") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_27.slots).default;
    const __VLS_27 = __VLS_pickFunctionalComponentCtx(__VLS_22, __VLS_24);
    let __VLS_25;
    let __VLS_26;
    const __VLS_30 = {}.ElCard;
    ({}.ElCard);
    ({}.ElCard);
    __VLS_components.ElCard;
    __VLS_components.elCard;
    __VLS_components.ElCard;
    __VLS_components.elCard;
    // @ts-ignore
    [ElCard, ElCard,];
    const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({ ...{ 'onClick': {} }, ...{ class: ("feature-card") }, }));
    const __VLS_32 = __VLS_31({ ...{ 'onClick': {} }, ...{ class: ("feature-card") }, }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    ({}({ ...{ 'onClick': {} }, ...{ class: ("feature-card") }, }));
    let __VLS_36;
    const __VLS_37 = {
        onClick: (...[$event]) => {
            __VLS_ctx.navigateTo('/register');
            // @ts-ignore
            [navigateTo,];
        }
    };
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("feature-icon") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_35.slots).default;
    const __VLS_35 = __VLS_pickFunctionalComponentCtx(__VLS_30, __VLS_32);
    let __VLS_33;
    let __VLS_34;
    (__VLS_5.slots).default;
    const __VLS_5 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2);
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses['home-container'];
        __VLS_styleScopedClasses['content-wrapper'];
        __VLS_styleScopedClasses['title'];
        __VLS_styleScopedClasses['description'];
        __VLS_styleScopedClasses['feature-grid'];
        __VLS_styleScopedClasses['feature-card'];
        __VLS_styleScopedClasses['feature-icon'];
        __VLS_styleScopedClasses['feature-card'];
        __VLS_styleScopedClasses['feature-icon'];
        __VLS_styleScopedClasses['feature-card'];
        __VLS_styleScopedClasses['feature-icon'];
        __VLS_styleScopedClasses['feature-card'];
        __VLS_styleScopedClasses['feature-icon'];
    }
    var __VLS_slots;
    return __VLS_slots;
    const __VLS_componentsOption = {};
    let __VLS_name;
    const __VLS_internalComponent = (await import('vue')).defineComponent({
        setup() {
            return {
                navigateTo: navigateTo,
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
