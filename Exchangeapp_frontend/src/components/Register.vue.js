/* __placeholder__ */
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import { ElMessage } from 'element-plus';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const form = ref({
    username: '',
    password: '',
    email: '',
    phone: '',
    adminKey: '',
});
const formRef = ref();
const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度应在3-20个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少6个字符', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ],
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ]
};
const authStore = useAuthStore();
const router = useRouter();
const register = async () => {
    if (!formRef.value)
        return;
    try {
        await formRef.value.validate();
        // 处理管理员密钥
        const userData = {
            username: form.value.username,
            password: form.value.password,
            email: form.value.email,
            phone: form.value.phone,
            role: form.value.adminKey === 'Trash-Fish' ? 'admin' : 'user'
        };
        await authStore.register(userData);
        router.push({ name: 'Home' });
        if (userData.role === 'admin') {
            ElMessage.success('管理员账号注册成功！');
        }
        else {
            ElMessage.success('注册成功！');
        }
    }
    catch (error) {
        if (error instanceof Error) {
            ElMessage.error(error.message);
        }
        else {
            ElMessage.error('注册失败，请重试。');
        }
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
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("auth-container") }, });
    const __VLS_0 = {}.ElForm;
    ({}.ElForm);
    ({}.ElForm);
    __VLS_components.ElForm;
    __VLS_components.elForm;
    __VLS_components.ElForm;
    __VLS_components.elForm;
    // @ts-ignore
    [ElForm, ElForm,];
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ...{ 'onSubmit': {} }, model: ((__VLS_ctx.form)), ...{ class: ("auth-form") }, rules: ((__VLS_ctx.rules)), ref: ("formRef"), }));
    const __VLS_2 = __VLS_1({ ...{ 'onSubmit': {} }, model: ((__VLS_ctx.form)), ...{ class: ("auth-form") }, rules: ((__VLS_ctx.rules)), ref: ("formRef"), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    ({}({ ...{ 'onSubmit': {} }, model: ((__VLS_ctx.form)), ...{ class: ("auth-form") }, rules: ((__VLS_ctx.rules)), ref: ("formRef"), }));
    // @ts-ignore
    (__VLS_ctx.formRef);
    let __VLS_6;
    const __VLS_7 = {
        onSubmit: (__VLS_ctx.register)
    };
    const __VLS_8 = {}.ElFormItem;
    ({}.ElFormItem);
    ({}.ElFormItem);
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    // @ts-ignore
    [ElFormItem, ElFormItem,];
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({ label: ("用户名"), labelWidth: ("100px"), prop: ("username"), }));
    const __VLS_10 = __VLS_9({ label: ("用户名"), labelWidth: ("100px"), prop: ("username"), }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    ({}({ label: ("用户名"), labelWidth: ("100px"), prop: ("username"), }));
    const __VLS_14 = {}.ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({ modelValue: ((__VLS_ctx.form.username)), placeholder: ("请输入用户名"), }));
    const __VLS_16 = __VLS_15({ modelValue: ((__VLS_ctx.form.username)), placeholder: ("请输入用户名"), }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    ({}({ modelValue: ((__VLS_ctx.form.username)), placeholder: ("请输入用户名"), }));
    // @ts-ignore
    [form, form, rules, formRef, register,];
    const __VLS_19 = __VLS_pickFunctionalComponentCtx(__VLS_14, __VLS_16);
    (__VLS_13.slots).default;
    const __VLS_13 = __VLS_pickFunctionalComponentCtx(__VLS_8, __VLS_10);
    const __VLS_20 = {}.ElFormItem;
    ({}.ElFormItem);
    ({}.ElFormItem);
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    // @ts-ignore
    [ElFormItem, ElFormItem,];
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({ label: ("密码"), labelWidth: ("100px"), prop: ("password"), }));
    const __VLS_22 = __VLS_21({ label: ("密码"), labelWidth: ("100px"), prop: ("password"), }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    ({}({ label: ("密码"), labelWidth: ("100px"), prop: ("password"), }));
    const __VLS_26 = {}.ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({ modelValue: ((__VLS_ctx.form.password)), type: ("password"), placeholder: ("请输入密码"), }));
    const __VLS_28 = __VLS_27({ modelValue: ((__VLS_ctx.form.password)), type: ("password"), placeholder: ("请输入密码"), }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    ({}({ modelValue: ((__VLS_ctx.form.password)), type: ("password"), placeholder: ("请输入密码"), }));
    // @ts-ignore
    [form,];
    const __VLS_31 = __VLS_pickFunctionalComponentCtx(__VLS_26, __VLS_28);
    (__VLS_25.slots).default;
    const __VLS_25 = __VLS_pickFunctionalComponentCtx(__VLS_20, __VLS_22);
    const __VLS_32 = {}.ElFormItem;
    ({}.ElFormItem);
    ({}.ElFormItem);
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    // @ts-ignore
    [ElFormItem, ElFormItem,];
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({ label: ("邮箱"), labelWidth: ("100px"), prop: ("email"), }));
    const __VLS_34 = __VLS_33({ label: ("邮箱"), labelWidth: ("100px"), prop: ("email"), }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    ({}({ label: ("邮箱"), labelWidth: ("100px"), prop: ("email"), }));
    const __VLS_38 = {}.ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({ modelValue: ((__VLS_ctx.form.email)), placeholder: ("请输入邮箱"), }));
    const __VLS_40 = __VLS_39({ modelValue: ((__VLS_ctx.form.email)), placeholder: ("请输入邮箱"), }, ...__VLS_functionalComponentArgsRest(__VLS_39));
    ({}({ modelValue: ((__VLS_ctx.form.email)), placeholder: ("请输入邮箱"), }));
    // @ts-ignore
    [form,];
    const __VLS_43 = __VLS_pickFunctionalComponentCtx(__VLS_38, __VLS_40);
    (__VLS_37.slots).default;
    const __VLS_37 = __VLS_pickFunctionalComponentCtx(__VLS_32, __VLS_34);
    const __VLS_44 = {}.ElFormItem;
    ({}.ElFormItem);
    ({}.ElFormItem);
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    // @ts-ignore
    [ElFormItem, ElFormItem,];
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({ label: ("手机号"), labelWidth: ("100px"), prop: ("phone"), }));
    const __VLS_46 = __VLS_45({ label: ("手机号"), labelWidth: ("100px"), prop: ("phone"), }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    ({}({ label: ("手机号"), labelWidth: ("100px"), prop: ("phone"), }));
    const __VLS_50 = {}.ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({ modelValue: ((__VLS_ctx.form.phone)), placeholder: ("请输入手机号"), }));
    const __VLS_52 = __VLS_51({ modelValue: ((__VLS_ctx.form.phone)), placeholder: ("请输入手机号"), }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    ({}({ modelValue: ((__VLS_ctx.form.phone)), placeholder: ("请输入手机号"), }));
    // @ts-ignore
    [form,];
    const __VLS_55 = __VLS_pickFunctionalComponentCtx(__VLS_50, __VLS_52);
    (__VLS_49.slots).default;
    const __VLS_49 = __VLS_pickFunctionalComponentCtx(__VLS_44, __VLS_46);
    const __VLS_56 = {}.ElFormItem;
    ({}.ElFormItem);
    ({}.ElFormItem);
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    // @ts-ignore
    [ElFormItem, ElFormItem,];
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({ label: ("管理员密钥"), labelWidth: ("100px"), prop: ("adminKey"), }));
    const __VLS_58 = __VLS_57({ label: ("管理员密钥"), labelWidth: ("100px"), prop: ("adminKey"), }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    ({}({ label: ("管理员密钥"), labelWidth: ("100px"), prop: ("adminKey"), }));
    const __VLS_62 = {}.ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({ modelValue: ((__VLS_ctx.form.adminKey)), placeholder: ("输入代码创建管理员账号（可选）"), type: ("password"), showPassword: (true), }));
    const __VLS_64 = __VLS_63({ modelValue: ((__VLS_ctx.form.adminKey)), placeholder: ("输入代码创建管理员账号（可选）"), type: ("password"), showPassword: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_63));
    ({}({ modelValue: ((__VLS_ctx.form.adminKey)), placeholder: ("输入代码创建管理员账号（可选）"), type: ("password"), showPassword: (true), }));
    // @ts-ignore
    [form,];
    const __VLS_67 = __VLS_pickFunctionalComponentCtx(__VLS_62, __VLS_64);
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("admin-tip") }, });
    (__VLS_61.slots).default;
    const __VLS_61 = __VLS_pickFunctionalComponentCtx(__VLS_56, __VLS_58);
    const __VLS_68 = {}.ElFormItem;
    ({}.ElFormItem);
    ({}.ElFormItem);
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    // @ts-ignore
    [ElFormItem, ElFormItem,];
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({}));
    const __VLS_70 = __VLS_69({}, ...__VLS_functionalComponentArgsRest(__VLS_69));
    ({}({}));
    const __VLS_74 = {}.ElButton;
    ({}.ElButton);
    ({}.ElButton);
    __VLS_components.ElButton;
    __VLS_components.elButton;
    __VLS_components.ElButton;
    __VLS_components.elButton;
    // @ts-ignore
    [ElButton, ElButton,];
    const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({ type: ("primary"), nativeType: ("submit"), }));
    const __VLS_76 = __VLS_75({ type: ("primary"), nativeType: ("submit"), }, ...__VLS_functionalComponentArgsRest(__VLS_75));
    ({}({ type: ("primary"), nativeType: ("submit"), }));
    (__VLS_79.slots).default;
    const __VLS_79 = __VLS_pickFunctionalComponentCtx(__VLS_74, __VLS_76);
    (__VLS_73.slots).default;
    const __VLS_73 = __VLS_pickFunctionalComponentCtx(__VLS_68, __VLS_70);
    (__VLS_5.slots).default;
    const __VLS_5 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2);
    let __VLS_3;
    let __VLS_4;
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses['auth-container'];
        __VLS_styleScopedClasses['auth-form'];
        __VLS_styleScopedClasses['admin-tip'];
    }
    var __VLS_slots;
    return __VLS_slots;
    const __VLS_componentsOption = {};
    let __VLS_name;
    const __VLS_internalComponent = (await import('vue')).defineComponent({
        setup() {
            return {
                form: form,
                formRef: formRef,
                rules: rules,
                register: register,
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
