/* __placeholder__ */
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import axios from '../axios';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const wallet = ref(null);
const bills = ref([]);
// 对话框显示状态
const createWalletVisible = ref(false);
const editWalletVisible = ref(false);
const depositVisible = ref(false);
const withdrawVisible = ref(false);
const exchangeVisible = ref(false);
const transferVisible = ref(false);
// 表单数据
const walletForm = ref({
    wallet_name: '',
    wallet_description: '',
    default_currency: 'CNY'
});
const depositForm = ref({
    amount: '',
    currency_code: 'CNY',
    description: ''
});
const withdrawForm = ref({
    amount: '',
    currency_code: '',
    description: ''
});
const exchangeForm = ref({
    amount: '',
    from_currency: '',
    to_currency: '',
    description: ''
});
const transferForm = ref({
    to_username: '',
    amount: '',
    currency_code: '',
    description: ''
});
// 获取钱包信息
const fetchWallet = async () => {
    try {
        const response = await axios.get('/wallets');
        wallet.value = response.data;
        console.log('钱包信息:', response.data);
    }
    catch (error) {
        console.error('Failed to load wallet:', error);
        if (error.response?.status === 404) {
            console.log('用户还没有钱包');
            wallet.value = null;
        }
        else {
            ElMessage.error('加载钱包信息失败');
        }
    }
};
// 获取账单
const fetchBills = async () => {
    try {
        const response = await axios.get('/wallets/bills');
        bills.value = response.data || [];
    }
    catch (error) {
        console.error('Failed to load bills:', error);
    }
};
// 创建钱包
const createWallet = async () => {
    try {
        console.log('创建钱包请求数据:', walletForm.value);
        const response = await axios.post('/wallets', walletForm.value);
        console.log('钱包创建成功响应:', response.data);
        createWalletVisible.value = false;
        await fetchWallet();
        ElMessage.success('钱包创建成功！');
        // 重置表单
        walletForm.value = {
            wallet_name: '',
            wallet_description: '',
            default_currency: 'CNY'
        };
    }
    catch (error) {
        console.error('钱包创建失败:', error);
        if (error.response?.data?.error) {
            ElMessage.error(`钱包创建失败: ${error.response.data.error}`);
        }
        else {
            ElMessage.error('钱包创建失败');
        }
    }
};
// 充值
const deposit = async () => {
    try {
        await axios.post('/wallets/deposit', depositForm.value);
        depositVisible.value = false;
        await fetchWallet();
        await fetchBills();
        ElMessage.success('充值成功！');
        // 重置表单
        depositForm.value = { amount: '', currency_code: 'CNY', description: '' };
    }
    catch (error) {
        ElMessage.error('充值失败');
    }
};
// 取出
const withdraw = async () => {
    try {
        await axios.post('/wallets/withdraw', withdrawForm.value);
        withdrawVisible.value = false;
        await fetchWallet();
        await fetchBills();
        ElMessage.success('取出成功！');
    }
    catch (error) {
        ElMessage.error('取出失败');
    }
};
// 兑换
const exchange = async () => {
    try {
        await axios.post('/wallets/exchange', exchangeForm.value);
        exchangeVisible.value = false;
        await fetchWallet();
        await fetchBills();
        ElMessage.success('兑换成功！');
    }
    catch (error) {
        ElMessage.error('兑换失败');
    }
};
// 转账
const transfer = async () => {
    try {
        const transferData = {
            amount: transferForm.value.amount,
            currency_code: transferForm.value.currency_code,
            description: transferForm.value.description
        };
        // 判断输入的是用户名还是用户ID
        if (transferForm.value.to_username) {
            if (/^\d+$/.test(transferForm.value.to_username)) {
                // 如果是纯数字，作为用户ID处理
                transferData.to_user_id = Number(transferForm.value.to_username);
            }
            else {
                // 否则作为用户名处理
                transferData.to_username = transferForm.value.to_username;
            }
        }
        await axios.post('/wallets/transfer', transferData);
        transferVisible.value = false;
        await fetchWallet();
        await fetchBills();
        ElMessage.success('转账成功！');
    }
    catch (error) {
        ElMessage.error('转账失败');
    }
};
// 启动取出操作
const startWithdraw = (balance) => {
    withdrawForm.value = {
        amount: '',
        currency_code: balance.currency_code,
        description: ''
    };
    withdrawVisible.value = true;
};
// 启动兑换操作
const startExchange = (balance) => {
    exchangeForm.value = {
        amount: '',
        from_currency: balance.currency_code,
        to_currency: '',
        description: ''
    };
    exchangeVisible.value = true;
};
// 启动转账操作
const startTransfer = (balance) => {
    transferForm.value = {
        to_username: '',
        amount: '',
        currency_code: balance.currency_code,
        description: ''
    };
    transferVisible.value = true;
};
// 工具函数
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-CN');
};
const getTransactionTypeName = (type) => {
    const typeMap = {
        deposit: '充值',
        withdraw: '取出',
        exchange: '兑换',
        transfer: '转账'
    };
    return typeMap[type] || type;
};
const getTransactionTypeColor = (type) => {
    const colorMap = {
        deposit: 'success',
        withdraw: 'warning',
        exchange: 'primary',
        transfer: 'info'
    };
    return colorMap[type] || 'default';
};
onMounted(() => {
    fetchWallet();
    fetchBills();
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
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ...{ class: ("wallet-container") }, }));
    const __VLS_2 = __VLS_1({ ...{ class: ("wallet-container") }, }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    ({}({ ...{ class: ("wallet-container") }, }));
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
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("wallet-header") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
    if (!__VLS_ctx.wallet) {
        const __VLS_12 = {}.ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({ ...{ 'onClick': {} }, type: ("primary"), }));
        const __VLS_14 = __VLS_13({ ...{ 'onClick': {} }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_13));
        ({}({ ...{ 'onClick': {} }, type: ("primary"), }));
        let __VLS_18;
        const __VLS_19 = {
            onClick: (...[$event]) => {
                if (!((!__VLS_ctx.wallet)))
                    return;
                __VLS_ctx.createWalletVisible = true;
                // @ts-ignore
                [wallet, createWalletVisible,];
            }
        };
        (__VLS_17.slots).default;
        const __VLS_17 = __VLS_pickFunctionalComponentCtx(__VLS_12, __VLS_14);
        let __VLS_15;
        let __VLS_16;
    }
    if (__VLS_ctx.wallet) {
        const __VLS_20 = {}.ElCard;
        ({}.ElCard);
        ({}.ElCard);
        __VLS_components.ElCard;
        __VLS_components.elCard;
        __VLS_components.ElCard;
        __VLS_components.elCard;
        // @ts-ignore
        [ElCard, ElCard,];
        const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({ ...{ class: ("wallet-info") }, shadow: ("hover"), }));
        const __VLS_22 = __VLS_21({ ...{ class: ("wallet-info") }, shadow: ("hover"), }, ...__VLS_functionalComponentArgsRest(__VLS_21));
        ({}({ ...{ class: ("wallet-info") }, shadow: ("hover"), }));
        __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
        {
            (__VLS_25.slots).header;
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("card-header") }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.wallet.wallet_name);
            // @ts-ignore
            [wallet, wallet,];
            const __VLS_26 = {}.ElButton;
            ({}.ElButton);
            ({}.ElButton);
            __VLS_components.ElButton;
            __VLS_components.elButton;
            __VLS_components.ElButton;
            __VLS_components.elButton;
            // @ts-ignore
            [ElButton, ElButton,];
            const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({ ...{ 'onClick': {} }, type: ("text"), }));
            const __VLS_28 = __VLS_27({ ...{ 'onClick': {} }, type: ("text"), }, ...__VLS_functionalComponentArgsRest(__VLS_27));
            ({}({ ...{ 'onClick': {} }, type: ("text"), }));
            let __VLS_32;
            const __VLS_33 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.wallet)))
                        return;
                    __VLS_ctx.editWalletVisible = true;
                    // @ts-ignore
                    [editWalletVisible,];
                }
            };
            (__VLS_31.slots).default;
            const __VLS_31 = __VLS_pickFunctionalComponentCtx(__VLS_26, __VLS_28);
            let __VLS_29;
            let __VLS_30;
        }
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("wallet-details") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.wallet.description || '无');
        // @ts-ignore
        [wallet,];
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.wallet.default_currency);
        // @ts-ignore
        [wallet,];
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        const __VLS_34 = {}.ElTag;
        ({}.ElTag);
        ({}.ElTag);
        __VLS_components.ElTag;
        __VLS_components.elTag;
        __VLS_components.ElTag;
        __VLS_components.elTag;
        // @ts-ignore
        [ElTag, ElTag,];
        const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({ type: ((__VLS_ctx.wallet.status === 'active' ? 'success' : 'danger')), }));
        const __VLS_36 = __VLS_35({ type: ((__VLS_ctx.wallet.status === 'active' ? 'success' : 'danger')), }, ...__VLS_functionalComponentArgsRest(__VLS_35));
        ({}({ type: ((__VLS_ctx.wallet.status === 'active' ? 'success' : 'danger')), }));
        (__VLS_ctx.wallet.status === 'active' ? '正常' : '冻结');
        // @ts-ignore
        [wallet, wallet,];
        (__VLS_39.slots).default;
        const __VLS_39 = __VLS_pickFunctionalComponentCtx(__VLS_34, __VLS_36);
        const __VLS_25 = __VLS_pickFunctionalComponentCtx(__VLS_20, __VLS_22);
    }
    if (__VLS_ctx.wallet && __VLS_ctx.wallet.balances.length) {
        const __VLS_40 = {}.ElCard;
        ({}.ElCard);
        ({}.ElCard);
        __VLS_components.ElCard;
        __VLS_components.elCard;
        __VLS_components.ElCard;
        __VLS_components.elCard;
        // @ts-ignore
        [ElCard, ElCard,];
        const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({ ...{ class: ("balance-card") }, shadow: ("hover"), }));
        const __VLS_42 = __VLS_41({ ...{ class: ("balance-card") }, shadow: ("hover"), }, ...__VLS_functionalComponentArgsRest(__VLS_41));
        ({}({ ...{ class: ("balance-card") }, shadow: ("hover"), }));
        __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
        {
            (__VLS_45.slots).header;
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("card-header") }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            // @ts-ignore
            [wallet, wallet,];
            const __VLS_46 = {}.ElButton;
            ({}.ElButton);
            ({}.ElButton);
            __VLS_components.ElButton;
            __VLS_components.elButton;
            __VLS_components.ElButton;
            __VLS_components.elButton;
            // @ts-ignore
            [ElButton, ElButton,];
            const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({ ...{ 'onClick': {} }, type: ("primary"), }));
            const __VLS_48 = __VLS_47({ ...{ 'onClick': {} }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_47));
            ({}({ ...{ 'onClick': {} }, type: ("primary"), }));
            let __VLS_52;
            const __VLS_53 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.wallet && __VLS_ctx.wallet.balances.length)))
                        return;
                    __VLS_ctx.depositVisible = true;
                    // @ts-ignore
                    [depositVisible,];
                }
            };
            (__VLS_51.slots).default;
            const __VLS_51 = __VLS_pickFunctionalComponentCtx(__VLS_46, __VLS_48);
            let __VLS_49;
            let __VLS_50;
        }
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("balance-grid") }, });
        for (const [balance] of __VLS_getVForSourceType((__VLS_ctx.wallet.balances))) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ key: ((balance.currency_code)), ...{ class: ("balance-item") }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("currency-code") }, });
            (balance.currency_code);
            // @ts-ignore
            [wallet,];
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("amount") }, });
            (balance.amount);
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("actions") }, });
            const __VLS_54 = {}.ElButton;
            ({}.ElButton);
            ({}.ElButton);
            __VLS_components.ElButton;
            __VLS_components.elButton;
            __VLS_components.ElButton;
            __VLS_components.elButton;
            // @ts-ignore
            [ElButton, ElButton,];
            const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({ ...{ 'onClick': {} }, size: ("small"), }));
            const __VLS_56 = __VLS_55({ ...{ 'onClick': {} }, size: ("small"), }, ...__VLS_functionalComponentArgsRest(__VLS_55));
            ({}({ ...{ 'onClick': {} }, size: ("small"), }));
            let __VLS_60;
            const __VLS_61 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.wallet && __VLS_ctx.wallet.balances.length)))
                        return;
                    __VLS_ctx.startWithdraw(balance);
                    // @ts-ignore
                    [startWithdraw,];
                }
            };
            (__VLS_59.slots).default;
            const __VLS_59 = __VLS_pickFunctionalComponentCtx(__VLS_54, __VLS_56);
            let __VLS_57;
            let __VLS_58;
            const __VLS_62 = {}.ElButton;
            ({}.ElButton);
            ({}.ElButton);
            __VLS_components.ElButton;
            __VLS_components.elButton;
            __VLS_components.ElButton;
            __VLS_components.elButton;
            // @ts-ignore
            [ElButton, ElButton,];
            const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({ ...{ 'onClick': {} }, size: ("small"), }));
            const __VLS_64 = __VLS_63({ ...{ 'onClick': {} }, size: ("small"), }, ...__VLS_functionalComponentArgsRest(__VLS_63));
            ({}({ ...{ 'onClick': {} }, size: ("small"), }));
            let __VLS_68;
            const __VLS_69 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.wallet && __VLS_ctx.wallet.balances.length)))
                        return;
                    __VLS_ctx.startExchange(balance);
                    // @ts-ignore
                    [startExchange,];
                }
            };
            (__VLS_67.slots).default;
            const __VLS_67 = __VLS_pickFunctionalComponentCtx(__VLS_62, __VLS_64);
            let __VLS_65;
            let __VLS_66;
            const __VLS_70 = {}.ElButton;
            ({}.ElButton);
            ({}.ElButton);
            __VLS_components.ElButton;
            __VLS_components.elButton;
            __VLS_components.ElButton;
            __VLS_components.elButton;
            // @ts-ignore
            [ElButton, ElButton,];
            const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({ ...{ 'onClick': {} }, size: ("small"), }));
            const __VLS_72 = __VLS_71({ ...{ 'onClick': {} }, size: ("small"), }, ...__VLS_functionalComponentArgsRest(__VLS_71));
            ({}({ ...{ 'onClick': {} }, size: ("small"), }));
            let __VLS_76;
            const __VLS_77 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.wallet && __VLS_ctx.wallet.balances.length)))
                        return;
                    __VLS_ctx.startTransfer(balance);
                    // @ts-ignore
                    [startTransfer,];
                }
            };
            (__VLS_75.slots).default;
            const __VLS_75 = __VLS_pickFunctionalComponentCtx(__VLS_70, __VLS_72);
            let __VLS_73;
            let __VLS_74;
        }
        const __VLS_45 = __VLS_pickFunctionalComponentCtx(__VLS_40, __VLS_42);
    }
    if (__VLS_ctx.bills.length) {
        const __VLS_78 = {}.ElCard;
        ({}.ElCard);
        ({}.ElCard);
        __VLS_components.ElCard;
        __VLS_components.elCard;
        __VLS_components.ElCard;
        __VLS_components.elCard;
        // @ts-ignore
        [ElCard, ElCard,];
        const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({ ...{ class: ("bills-card") }, shadow: ("hover"), }));
        const __VLS_80 = __VLS_79({ ...{ class: ("bills-card") }, shadow: ("hover"), }, ...__VLS_functionalComponentArgsRest(__VLS_79));
        ({}({ ...{ class: ("bills-card") }, shadow: ("hover"), }));
        __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
        {
            (__VLS_83.slots).header;
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            // @ts-ignore
            [bills,];
        }
        const __VLS_84 = {}.ElTable;
        ({}.ElTable);
        ({}.ElTable);
        __VLS_components.ElTable;
        __VLS_components.elTable;
        __VLS_components.ElTable;
        __VLS_components.elTable;
        // @ts-ignore
        [ElTable, ElTable,];
        const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({ data: ((__VLS_ctx.bills)), ...{ style: ({}) }, }));
        const __VLS_86 = __VLS_85({ data: ((__VLS_ctx.bills)), ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_85));
        ({}({ data: ((__VLS_ctx.bills)), ...{ style: ({}) }, }));
        const __VLS_90 = {}.ElTableColumn;
        ({}.ElTableColumn);
        ({}.ElTableColumn);
        __VLS_components.ElTableColumn;
        __VLS_components.elTableColumn;
        __VLS_components.ElTableColumn;
        __VLS_components.elTableColumn;
        // @ts-ignore
        [ElTableColumn, ElTableColumn,];
        const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({ prop: ("TransactionType"), label: ("类型"), width: ("100"), }));
        const __VLS_92 = __VLS_91({ prop: ("TransactionType"), label: ("类型"), width: ("100"), }, ...__VLS_functionalComponentArgsRest(__VLS_91));
        ({}({ prop: ("TransactionType"), label: ("类型"), width: ("100"), }));
        __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
        {
            const [scope] = __VLS_getSlotParams((__VLS_95.slots).default);
            const __VLS_96 = {}.ElTag;
            ({}.ElTag);
            ({}.ElTag);
            __VLS_components.ElTag;
            __VLS_components.elTag;
            __VLS_components.ElTag;
            __VLS_components.elTag;
            // @ts-ignore
            [ElTag, ElTag,];
            const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({ type: ((__VLS_ctx.getTransactionTypeColor(scope.row.TransactionType))), }));
            const __VLS_98 = __VLS_97({ type: ((__VLS_ctx.getTransactionTypeColor(scope.row.TransactionType))), }, ...__VLS_functionalComponentArgsRest(__VLS_97));
            ({}({ type: ((__VLS_ctx.getTransactionTypeColor(scope.row.TransactionType))), }));
            (__VLS_ctx.getTransactionTypeName(scope.row.TransactionType));
            // @ts-ignore
            [bills, getTransactionTypeColor, getTransactionTypeName,];
            (__VLS_101.slots).default;
            const __VLS_101 = __VLS_pickFunctionalComponentCtx(__VLS_96, __VLS_98);
        }
        const __VLS_95 = __VLS_pickFunctionalComponentCtx(__VLS_90, __VLS_92);
        const __VLS_102 = {}.ElTableColumn;
        ({}.ElTableColumn);
        __VLS_components.ElTableColumn;
        __VLS_components.elTableColumn;
        // @ts-ignore
        [ElTableColumn,];
        const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({ prop: ("Amount"), label: ("金额"), width: ("120"), }));
        const __VLS_104 = __VLS_103({ prop: ("Amount"), label: ("金额"), width: ("120"), }, ...__VLS_functionalComponentArgsRest(__VLS_103));
        ({}({ prop: ("Amount"), label: ("金额"), width: ("120"), }));
        const __VLS_107 = __VLS_pickFunctionalComponentCtx(__VLS_102, __VLS_104);
        const __VLS_108 = {}.ElTableColumn;
        ({}.ElTableColumn);
        __VLS_components.ElTableColumn;
        __VLS_components.elTableColumn;
        // @ts-ignore
        [ElTableColumn,];
        const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({ prop: ("CurrencyCode"), label: ("货币"), width: ("80"), }));
        const __VLS_110 = __VLS_109({ prop: ("CurrencyCode"), label: ("货币"), width: ("80"), }, ...__VLS_functionalComponentArgsRest(__VLS_109));
        ({}({ prop: ("CurrencyCode"), label: ("货币"), width: ("80"), }));
        const __VLS_113 = __VLS_pickFunctionalComponentCtx(__VLS_108, __VLS_110);
        const __VLS_114 = {}.ElTableColumn;
        ({}.ElTableColumn);
        __VLS_components.ElTableColumn;
        __VLS_components.elTableColumn;
        // @ts-ignore
        [ElTableColumn,];
        const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({ prop: ("Description"), label: ("描述"), }));
        const __VLS_116 = __VLS_115({ prop: ("Description"), label: ("描述"), }, ...__VLS_functionalComponentArgsRest(__VLS_115));
        ({}({ prop: ("Description"), label: ("描述"), }));
        const __VLS_119 = __VLS_pickFunctionalComponentCtx(__VLS_114, __VLS_116);
        const __VLS_120 = {}.ElTableColumn;
        ({}.ElTableColumn);
        ({}.ElTableColumn);
        __VLS_components.ElTableColumn;
        __VLS_components.elTableColumn;
        __VLS_components.ElTableColumn;
        __VLS_components.elTableColumn;
        // @ts-ignore
        [ElTableColumn, ElTableColumn,];
        const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({ prop: ("Status"), label: ("状态"), width: ("80"), }));
        const __VLS_122 = __VLS_121({ prop: ("Status"), label: ("状态"), width: ("80"), }, ...__VLS_functionalComponentArgsRest(__VLS_121));
        ({}({ prop: ("Status"), label: ("状态"), width: ("80"), }));
        __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
        {
            const [scope] = __VLS_getSlotParams((__VLS_125.slots).default);
            const __VLS_126 = {}.ElTag;
            ({}.ElTag);
            ({}.ElTag);
            __VLS_components.ElTag;
            __VLS_components.elTag;
            __VLS_components.ElTag;
            __VLS_components.elTag;
            // @ts-ignore
            [ElTag, ElTag,];
            const __VLS_127 = __VLS_asFunctionalComponent(__VLS_126, new __VLS_126({ type: ((scope.row.Status === 'completed' ? 'success' : 'warning')), }));
            const __VLS_128 = __VLS_127({ type: ((scope.row.Status === 'completed' ? 'success' : 'warning')), }, ...__VLS_functionalComponentArgsRest(__VLS_127));
            ({}({ type: ((scope.row.Status === 'completed' ? 'success' : 'warning')), }));
            (scope.row.Status === 'completed' ? '完成' : '处理中');
            (__VLS_131.slots).default;
            const __VLS_131 = __VLS_pickFunctionalComponentCtx(__VLS_126, __VLS_128);
        }
        const __VLS_125 = __VLS_pickFunctionalComponentCtx(__VLS_120, __VLS_122);
        const __VLS_132 = {}.ElTableColumn;
        ({}.ElTableColumn);
        ({}.ElTableColumn);
        __VLS_components.ElTableColumn;
        __VLS_components.elTableColumn;
        __VLS_components.ElTableColumn;
        __VLS_components.elTableColumn;
        // @ts-ignore
        [ElTableColumn, ElTableColumn,];
        const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({ prop: ("CreatedAt"), label: ("时间"), width: ("180"), }));
        const __VLS_134 = __VLS_133({ prop: ("CreatedAt"), label: ("时间"), width: ("180"), }, ...__VLS_functionalComponentArgsRest(__VLS_133));
        ({}({ prop: ("CreatedAt"), label: ("时间"), width: ("180"), }));
        __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
        {
            const [scope] = __VLS_getSlotParams((__VLS_137.slots).default);
            (__VLS_ctx.formatDate(scope.row.CreatedAt));
            // @ts-ignore
            [formatDate,];
        }
        const __VLS_137 = __VLS_pickFunctionalComponentCtx(__VLS_132, __VLS_134);
        (__VLS_89.slots).default;
        const __VLS_89 = __VLS_pickFunctionalComponentCtx(__VLS_84, __VLS_86);
        const __VLS_83 = __VLS_pickFunctionalComponentCtx(__VLS_78, __VLS_80);
    }
    const __VLS_138 = {}.ElDialog;
    ({}.ElDialog);
    ({}.ElDialog);
    __VLS_components.ElDialog;
    __VLS_components.elDialog;
    __VLS_components.ElDialog;
    __VLS_components.elDialog;
    // @ts-ignore
    [ElDialog, ElDialog,];
    const __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({ modelValue: ((__VLS_ctx.createWalletVisible)), title: ("创建钱包"), width: ("500px"), }));
    const __VLS_140 = __VLS_139({ modelValue: ((__VLS_ctx.createWalletVisible)), title: ("创建钱包"), width: ("500px"), }, ...__VLS_functionalComponentArgsRest(__VLS_139));
    ({}({ modelValue: ((__VLS_ctx.createWalletVisible)), title: ("创建钱包"), width: ("500px"), }));
    const __VLS_144 = {}.ElForm;
    ({}.ElForm);
    ({}.ElForm);
    __VLS_components.ElForm;
    __VLS_components.elForm;
    __VLS_components.ElForm;
    __VLS_components.elForm;
    // @ts-ignore
    [ElForm, ElForm,];
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({ model: ((__VLS_ctx.walletForm)), labelWidth: ("120px"), }));
    const __VLS_146 = __VLS_145({ model: ((__VLS_ctx.walletForm)), labelWidth: ("120px"), }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    ({}({ model: ((__VLS_ctx.walletForm)), labelWidth: ("120px"), }));
    const __VLS_150 = {}.ElFormItem;
    ({}.ElFormItem);
    ({}.ElFormItem);
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    // @ts-ignore
    [ElFormItem, ElFormItem,];
    const __VLS_151 = __VLS_asFunctionalComponent(__VLS_150, new __VLS_150({ label: ("钱包名称"), required: (true), }));
    const __VLS_152 = __VLS_151({ label: ("钱包名称"), required: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_151));
    ({}({ label: ("钱包名称"), required: (true), }));
    const __VLS_156 = {}.ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({ modelValue: ((__VLS_ctx.walletForm.wallet_name)), placeholder: ("请输入钱包名称"), }));
    const __VLS_158 = __VLS_157({ modelValue: ((__VLS_ctx.walletForm.wallet_name)), placeholder: ("请输入钱包名称"), }, ...__VLS_functionalComponentArgsRest(__VLS_157));
    ({}({ modelValue: ((__VLS_ctx.walletForm.wallet_name)), placeholder: ("请输入钱包名称"), }));
    // @ts-ignore
    [createWalletVisible, walletForm, walletForm,];
    const __VLS_161 = __VLS_pickFunctionalComponentCtx(__VLS_156, __VLS_158);
    (__VLS_155.slots).default;
    const __VLS_155 = __VLS_pickFunctionalComponentCtx(__VLS_150, __VLS_152);
    const __VLS_162 = {}.ElFormItem;
    ({}.ElFormItem);
    ({}.ElFormItem);
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    // @ts-ignore
    [ElFormItem, ElFormItem,];
    const __VLS_163 = __VLS_asFunctionalComponent(__VLS_162, new __VLS_162({ label: ("钱包描述"), }));
    const __VLS_164 = __VLS_163({ label: ("钱包描述"), }, ...__VLS_functionalComponentArgsRest(__VLS_163));
    ({}({ label: ("钱包描述"), }));
    const __VLS_168 = {}.ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({ modelValue: ((__VLS_ctx.walletForm.wallet_description)), type: ("textarea"), placeholder: ("请输入钱包描述"), }));
    const __VLS_170 = __VLS_169({ modelValue: ((__VLS_ctx.walletForm.wallet_description)), type: ("textarea"), placeholder: ("请输入钱包描述"), }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    ({}({ modelValue: ((__VLS_ctx.walletForm.wallet_description)), type: ("textarea"), placeholder: ("请输入钱包描述"), }));
    // @ts-ignore
    [walletForm,];
    const __VLS_173 = __VLS_pickFunctionalComponentCtx(__VLS_168, __VLS_170);
    (__VLS_167.slots).default;
    const __VLS_167 = __VLS_pickFunctionalComponentCtx(__VLS_162, __VLS_164);
    const __VLS_174 = {}.ElFormItem;
    ({}.ElFormItem);
    ({}.ElFormItem);
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    // @ts-ignore
    [ElFormItem, ElFormItem,];
    const __VLS_175 = __VLS_asFunctionalComponent(__VLS_174, new __VLS_174({ label: ("默认货币"), required: (true), }));
    const __VLS_176 = __VLS_175({ label: ("默认货币"), required: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_175));
    ({}({ label: ("默认货币"), required: (true), }));
    const __VLS_180 = {}.ElSelect;
    ({}.ElSelect);
    ({}.ElSelect);
    __VLS_components.ElSelect;
    __VLS_components.elSelect;
    __VLS_components.ElSelect;
    __VLS_components.elSelect;
    // @ts-ignore
    [ElSelect, ElSelect,];
    const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({ modelValue: ((__VLS_ctx.walletForm.default_currency)), placeholder: ("选择默认货币"), }));
    const __VLS_182 = __VLS_181({ modelValue: ((__VLS_ctx.walletForm.default_currency)), placeholder: ("选择默认货币"), }, ...__VLS_functionalComponentArgsRest(__VLS_181));
    ({}({ modelValue: ((__VLS_ctx.walletForm.default_currency)), placeholder: ("选择默认货币"), }));
    const __VLS_186 = {}.ElOption;
    ({}.ElOption);
    __VLS_components.ElOption;
    __VLS_components.elOption;
    // @ts-ignore
    [ElOption,];
    const __VLS_187 = __VLS_asFunctionalComponent(__VLS_186, new __VLS_186({ label: ("人民币 (CNY)"), value: ("CNY"), }));
    const __VLS_188 = __VLS_187({ label: ("人民币 (CNY)"), value: ("CNY"), }, ...__VLS_functionalComponentArgsRest(__VLS_187));
    ({}({ label: ("人民币 (CNY)"), value: ("CNY"), }));
    // @ts-ignore
    [walletForm,];
    const __VLS_191 = __VLS_pickFunctionalComponentCtx(__VLS_186, __VLS_188);
    const __VLS_192 = {}.ElOption;
    ({}.ElOption);
    __VLS_components.ElOption;
    __VLS_components.elOption;
    // @ts-ignore
    [ElOption,];
    const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({ label: ("美元 (USD)"), value: ("USD"), }));
    const __VLS_194 = __VLS_193({ label: ("美元 (USD)"), value: ("USD"), }, ...__VLS_functionalComponentArgsRest(__VLS_193));
    ({}({ label: ("美元 (USD)"), value: ("USD"), }));
    const __VLS_197 = __VLS_pickFunctionalComponentCtx(__VLS_192, __VLS_194);
    const __VLS_198 = {}.ElOption;
    ({}.ElOption);
    __VLS_components.ElOption;
    __VLS_components.elOption;
    // @ts-ignore
    [ElOption,];
    const __VLS_199 = __VLS_asFunctionalComponent(__VLS_198, new __VLS_198({ label: ("日元 (JPY)"), value: ("JPY"), }));
    const __VLS_200 = __VLS_199({ label: ("日元 (JPY)"), value: ("JPY"), }, ...__VLS_functionalComponentArgsRest(__VLS_199));
    ({}({ label: ("日元 (JPY)"), value: ("JPY"), }));
    const __VLS_203 = __VLS_pickFunctionalComponentCtx(__VLS_198, __VLS_200);
    const __VLS_204 = {}.ElOption;
    ({}.ElOption);
    __VLS_components.ElOption;
    __VLS_components.elOption;
    // @ts-ignore
    [ElOption,];
    const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({ label: ("欧元 (EUR)"), value: ("EUR"), }));
    const __VLS_206 = __VLS_205({ label: ("欧元 (EUR)"), value: ("EUR"), }, ...__VLS_functionalComponentArgsRest(__VLS_205));
    ({}({ label: ("欧元 (EUR)"), value: ("EUR"), }));
    const __VLS_209 = __VLS_pickFunctionalComponentCtx(__VLS_204, __VLS_206);
    (__VLS_185.slots).default;
    const __VLS_185 = __VLS_pickFunctionalComponentCtx(__VLS_180, __VLS_182);
    (__VLS_179.slots).default;
    const __VLS_179 = __VLS_pickFunctionalComponentCtx(__VLS_174, __VLS_176);
    (__VLS_149.slots).default;
    const __VLS_149 = __VLS_pickFunctionalComponentCtx(__VLS_144, __VLS_146);
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        (__VLS_143.slots).footer;
        const __VLS_210 = {}.ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        const __VLS_211 = __VLS_asFunctionalComponent(__VLS_210, new __VLS_210({ ...{ 'onClick': {} }, }));
        const __VLS_212 = __VLS_211({ ...{ 'onClick': {} }, }, ...__VLS_functionalComponentArgsRest(__VLS_211));
        ({}({ ...{ 'onClick': {} }, }));
        let __VLS_216;
        const __VLS_217 = {
            onClick: (...[$event]) => {
                __VLS_ctx.createWalletVisible = false;
                // @ts-ignore
                [createWalletVisible,];
            }
        };
        (__VLS_215.slots).default;
        const __VLS_215 = __VLS_pickFunctionalComponentCtx(__VLS_210, __VLS_212);
        let __VLS_213;
        let __VLS_214;
        const __VLS_218 = {}.ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        const __VLS_219 = __VLS_asFunctionalComponent(__VLS_218, new __VLS_218({ ...{ 'onClick': {} }, type: ("primary"), }));
        const __VLS_220 = __VLS_219({ ...{ 'onClick': {} }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_219));
        ({}({ ...{ 'onClick': {} }, type: ("primary"), }));
        let __VLS_224;
        const __VLS_225 = {
            onClick: (__VLS_ctx.createWallet)
        };
        // @ts-ignore
        [createWallet,];
        (__VLS_223.slots).default;
        const __VLS_223 = __VLS_pickFunctionalComponentCtx(__VLS_218, __VLS_220);
        let __VLS_221;
        let __VLS_222;
    }
    const __VLS_143 = __VLS_pickFunctionalComponentCtx(__VLS_138, __VLS_140);
    const __VLS_226 = {}.ElDialog;
    ({}.ElDialog);
    ({}.ElDialog);
    __VLS_components.ElDialog;
    __VLS_components.elDialog;
    __VLS_components.ElDialog;
    __VLS_components.elDialog;
    // @ts-ignore
    [ElDialog, ElDialog,];
    const __VLS_227 = __VLS_asFunctionalComponent(__VLS_226, new __VLS_226({ modelValue: ((__VLS_ctx.depositVisible)), title: ("充值"), width: ("400px"), }));
    const __VLS_228 = __VLS_227({ modelValue: ((__VLS_ctx.depositVisible)), title: ("充值"), width: ("400px"), }, ...__VLS_functionalComponentArgsRest(__VLS_227));
    ({}({ modelValue: ((__VLS_ctx.depositVisible)), title: ("充值"), width: ("400px"), }));
    const __VLS_232 = {}.ElForm;
    ({}.ElForm);
    ({}.ElForm);
    __VLS_components.ElForm;
    __VLS_components.elForm;
    __VLS_components.ElForm;
    __VLS_components.elForm;
    // @ts-ignore
    [ElForm, ElForm,];
    const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({ model: ((__VLS_ctx.depositForm)), labelWidth: ("80px"), }));
    const __VLS_234 = __VLS_233({ model: ((__VLS_ctx.depositForm)), labelWidth: ("80px"), }, ...__VLS_functionalComponentArgsRest(__VLS_233));
    ({}({ model: ((__VLS_ctx.depositForm)), labelWidth: ("80px"), }));
    const __VLS_238 = {}.ElFormItem;
    ({}.ElFormItem);
    ({}.ElFormItem);
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    // @ts-ignore
    [ElFormItem, ElFormItem,];
    const __VLS_239 = __VLS_asFunctionalComponent(__VLS_238, new __VLS_238({ label: ("金额"), required: (true), }));
    const __VLS_240 = __VLS_239({ label: ("金额"), required: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_239));
    ({}({ label: ("金额"), required: (true), }));
    const __VLS_244 = {}.ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({ modelValue: ((__VLS_ctx.depositForm.amount)), placeholder: ("请输入充值金额"), }));
    const __VLS_246 = __VLS_245({ modelValue: ((__VLS_ctx.depositForm.amount)), placeholder: ("请输入充值金额"), }, ...__VLS_functionalComponentArgsRest(__VLS_245));
    ({}({ modelValue: ((__VLS_ctx.depositForm.amount)), placeholder: ("请输入充值金额"), }));
    // @ts-ignore
    [depositVisible, depositForm, depositForm,];
    const __VLS_249 = __VLS_pickFunctionalComponentCtx(__VLS_244, __VLS_246);
    (__VLS_243.slots).default;
    const __VLS_243 = __VLS_pickFunctionalComponentCtx(__VLS_238, __VLS_240);
    const __VLS_250 = {}.ElFormItem;
    ({}.ElFormItem);
    ({}.ElFormItem);
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    // @ts-ignore
    [ElFormItem, ElFormItem,];
    const __VLS_251 = __VLS_asFunctionalComponent(__VLS_250, new __VLS_250({ label: ("货币"), required: (true), }));
    const __VLS_252 = __VLS_251({ label: ("货币"), required: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_251));
    ({}({ label: ("货币"), required: (true), }));
    const __VLS_256 = {}.ElSelect;
    ({}.ElSelect);
    ({}.ElSelect);
    __VLS_components.ElSelect;
    __VLS_components.elSelect;
    __VLS_components.ElSelect;
    __VLS_components.elSelect;
    // @ts-ignore
    [ElSelect, ElSelect,];
    const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({ modelValue: ((__VLS_ctx.depositForm.currency_code)), placeholder: ("选择货币"), }));
    const __VLS_258 = __VLS_257({ modelValue: ((__VLS_ctx.depositForm.currency_code)), placeholder: ("选择货币"), }, ...__VLS_functionalComponentArgsRest(__VLS_257));
    ({}({ modelValue: ((__VLS_ctx.depositForm.currency_code)), placeholder: ("选择货币"), }));
    const __VLS_262 = {}.ElOption;
    ({}.ElOption);
    __VLS_components.ElOption;
    __VLS_components.elOption;
    // @ts-ignore
    [ElOption,];
    const __VLS_263 = __VLS_asFunctionalComponent(__VLS_262, new __VLS_262({ label: ("CNY"), value: ("CNY"), }));
    const __VLS_264 = __VLS_263({ label: ("CNY"), value: ("CNY"), }, ...__VLS_functionalComponentArgsRest(__VLS_263));
    ({}({ label: ("CNY"), value: ("CNY"), }));
    // @ts-ignore
    [depositForm,];
    const __VLS_267 = __VLS_pickFunctionalComponentCtx(__VLS_262, __VLS_264);
    const __VLS_268 = {}.ElOption;
    ({}.ElOption);
    __VLS_components.ElOption;
    __VLS_components.elOption;
    // @ts-ignore
    [ElOption,];
    const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({ label: ("USD"), value: ("USD"), }));
    const __VLS_270 = __VLS_269({ label: ("USD"), value: ("USD"), }, ...__VLS_functionalComponentArgsRest(__VLS_269));
    ({}({ label: ("USD"), value: ("USD"), }));
    const __VLS_273 = __VLS_pickFunctionalComponentCtx(__VLS_268, __VLS_270);
    const __VLS_274 = {}.ElOption;
    ({}.ElOption);
    __VLS_components.ElOption;
    __VLS_components.elOption;
    // @ts-ignore
    [ElOption,];
    const __VLS_275 = __VLS_asFunctionalComponent(__VLS_274, new __VLS_274({ label: ("JPY"), value: ("JPY"), }));
    const __VLS_276 = __VLS_275({ label: ("JPY"), value: ("JPY"), }, ...__VLS_functionalComponentArgsRest(__VLS_275));
    ({}({ label: ("JPY"), value: ("JPY"), }));
    const __VLS_279 = __VLS_pickFunctionalComponentCtx(__VLS_274, __VLS_276);
    const __VLS_280 = {}.ElOption;
    ({}.ElOption);
    __VLS_components.ElOption;
    __VLS_components.elOption;
    // @ts-ignore
    [ElOption,];
    const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({ label: ("EUR"), value: ("EUR"), }));
    const __VLS_282 = __VLS_281({ label: ("EUR"), value: ("EUR"), }, ...__VLS_functionalComponentArgsRest(__VLS_281));
    ({}({ label: ("EUR"), value: ("EUR"), }));
    const __VLS_285 = __VLS_pickFunctionalComponentCtx(__VLS_280, __VLS_282);
    (__VLS_261.slots).default;
    const __VLS_261 = __VLS_pickFunctionalComponentCtx(__VLS_256, __VLS_258);
    (__VLS_255.slots).default;
    const __VLS_255 = __VLS_pickFunctionalComponentCtx(__VLS_250, __VLS_252);
    const __VLS_286 = {}.ElFormItem;
    ({}.ElFormItem);
    ({}.ElFormItem);
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    // @ts-ignore
    [ElFormItem, ElFormItem,];
    const __VLS_287 = __VLS_asFunctionalComponent(__VLS_286, new __VLS_286({ label: ("备注"), }));
    const __VLS_288 = __VLS_287({ label: ("备注"), }, ...__VLS_functionalComponentArgsRest(__VLS_287));
    ({}({ label: ("备注"), }));
    const __VLS_292 = {}.ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({ modelValue: ((__VLS_ctx.depositForm.description)), placeholder: ("可选"), }));
    const __VLS_294 = __VLS_293({ modelValue: ((__VLS_ctx.depositForm.description)), placeholder: ("可选"), }, ...__VLS_functionalComponentArgsRest(__VLS_293));
    ({}({ modelValue: ((__VLS_ctx.depositForm.description)), placeholder: ("可选"), }));
    // @ts-ignore
    [depositForm,];
    const __VLS_297 = __VLS_pickFunctionalComponentCtx(__VLS_292, __VLS_294);
    (__VLS_291.slots).default;
    const __VLS_291 = __VLS_pickFunctionalComponentCtx(__VLS_286, __VLS_288);
    (__VLS_237.slots).default;
    const __VLS_237 = __VLS_pickFunctionalComponentCtx(__VLS_232, __VLS_234);
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        (__VLS_231.slots).footer;
        const __VLS_298 = {}.ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        const __VLS_299 = __VLS_asFunctionalComponent(__VLS_298, new __VLS_298({ ...{ 'onClick': {} }, }));
        const __VLS_300 = __VLS_299({ ...{ 'onClick': {} }, }, ...__VLS_functionalComponentArgsRest(__VLS_299));
        ({}({ ...{ 'onClick': {} }, }));
        let __VLS_304;
        const __VLS_305 = {
            onClick: (...[$event]) => {
                __VLS_ctx.depositVisible = false;
                // @ts-ignore
                [depositVisible,];
            }
        };
        (__VLS_303.slots).default;
        const __VLS_303 = __VLS_pickFunctionalComponentCtx(__VLS_298, __VLS_300);
        let __VLS_301;
        let __VLS_302;
        const __VLS_306 = {}.ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        const __VLS_307 = __VLS_asFunctionalComponent(__VLS_306, new __VLS_306({ ...{ 'onClick': {} }, type: ("primary"), }));
        const __VLS_308 = __VLS_307({ ...{ 'onClick': {} }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_307));
        ({}({ ...{ 'onClick': {} }, type: ("primary"), }));
        let __VLS_312;
        const __VLS_313 = {
            onClick: (__VLS_ctx.deposit)
        };
        // @ts-ignore
        [deposit,];
        (__VLS_311.slots).default;
        const __VLS_311 = __VLS_pickFunctionalComponentCtx(__VLS_306, __VLS_308);
        let __VLS_309;
        let __VLS_310;
    }
    const __VLS_231 = __VLS_pickFunctionalComponentCtx(__VLS_226, __VLS_228);
    const __VLS_314 = {}.ElDialog;
    ({}.ElDialog);
    ({}.ElDialog);
    __VLS_components.ElDialog;
    __VLS_components.elDialog;
    __VLS_components.ElDialog;
    __VLS_components.elDialog;
    // @ts-ignore
    [ElDialog, ElDialog,];
    const __VLS_315 = __VLS_asFunctionalComponent(__VLS_314, new __VLS_314({ modelValue: ((__VLS_ctx.withdrawVisible)), title: ("取出"), width: ("400px"), }));
    const __VLS_316 = __VLS_315({ modelValue: ((__VLS_ctx.withdrawVisible)), title: ("取出"), width: ("400px"), }, ...__VLS_functionalComponentArgsRest(__VLS_315));
    ({}({ modelValue: ((__VLS_ctx.withdrawVisible)), title: ("取出"), width: ("400px"), }));
    const __VLS_320 = {}.ElForm;
    ({}.ElForm);
    ({}.ElForm);
    __VLS_components.ElForm;
    __VLS_components.elForm;
    __VLS_components.ElForm;
    __VLS_components.elForm;
    // @ts-ignore
    [ElForm, ElForm,];
    const __VLS_321 = __VLS_asFunctionalComponent(__VLS_320, new __VLS_320({ model: ((__VLS_ctx.withdrawForm)), labelWidth: ("80px"), }));
    const __VLS_322 = __VLS_321({ model: ((__VLS_ctx.withdrawForm)), labelWidth: ("80px"), }, ...__VLS_functionalComponentArgsRest(__VLS_321));
    ({}({ model: ((__VLS_ctx.withdrawForm)), labelWidth: ("80px"), }));
    const __VLS_326 = {}.ElFormItem;
    ({}.ElFormItem);
    ({}.ElFormItem);
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    // @ts-ignore
    [ElFormItem, ElFormItem,];
    const __VLS_327 = __VLS_asFunctionalComponent(__VLS_326, new __VLS_326({ label: ("金额"), required: (true), }));
    const __VLS_328 = __VLS_327({ label: ("金额"), required: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_327));
    ({}({ label: ("金额"), required: (true), }));
    const __VLS_332 = {}.ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    const __VLS_333 = __VLS_asFunctionalComponent(__VLS_332, new __VLS_332({ modelValue: ((__VLS_ctx.withdrawForm.amount)), placeholder: ("请输入取出金额"), }));
    const __VLS_334 = __VLS_333({ modelValue: ((__VLS_ctx.withdrawForm.amount)), placeholder: ("请输入取出金额"), }, ...__VLS_functionalComponentArgsRest(__VLS_333));
    ({}({ modelValue: ((__VLS_ctx.withdrawForm.amount)), placeholder: ("请输入取出金额"), }));
    // @ts-ignore
    [withdrawVisible, withdrawForm, withdrawForm,];
    const __VLS_337 = __VLS_pickFunctionalComponentCtx(__VLS_332, __VLS_334);
    (__VLS_331.slots).default;
    const __VLS_331 = __VLS_pickFunctionalComponentCtx(__VLS_326, __VLS_328);
    const __VLS_338 = {}.ElFormItem;
    ({}.ElFormItem);
    ({}.ElFormItem);
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    // @ts-ignore
    [ElFormItem, ElFormItem,];
    const __VLS_339 = __VLS_asFunctionalComponent(__VLS_338, new __VLS_338({ label: ("货币"), required: (true), }));
    const __VLS_340 = __VLS_339({ label: ("货币"), required: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_339));
    ({}({ label: ("货币"), required: (true), }));
    const __VLS_344 = {}.ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    const __VLS_345 = __VLS_asFunctionalComponent(__VLS_344, new __VLS_344({ modelValue: ((__VLS_ctx.withdrawForm.currency_code)), readonly: (true), }));
    const __VLS_346 = __VLS_345({ modelValue: ((__VLS_ctx.withdrawForm.currency_code)), readonly: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_345));
    ({}({ modelValue: ((__VLS_ctx.withdrawForm.currency_code)), readonly: (true), }));
    // @ts-ignore
    [withdrawForm,];
    const __VLS_349 = __VLS_pickFunctionalComponentCtx(__VLS_344, __VLS_346);
    (__VLS_343.slots).default;
    const __VLS_343 = __VLS_pickFunctionalComponentCtx(__VLS_338, __VLS_340);
    const __VLS_350 = {}.ElFormItem;
    ({}.ElFormItem);
    ({}.ElFormItem);
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    // @ts-ignore
    [ElFormItem, ElFormItem,];
    const __VLS_351 = __VLS_asFunctionalComponent(__VLS_350, new __VLS_350({ label: ("备注"), }));
    const __VLS_352 = __VLS_351({ label: ("备注"), }, ...__VLS_functionalComponentArgsRest(__VLS_351));
    ({}({ label: ("备注"), }));
    const __VLS_356 = {}.ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    const __VLS_357 = __VLS_asFunctionalComponent(__VLS_356, new __VLS_356({ modelValue: ((__VLS_ctx.withdrawForm.description)), placeholder: ("可选"), }));
    const __VLS_358 = __VLS_357({ modelValue: ((__VLS_ctx.withdrawForm.description)), placeholder: ("可选"), }, ...__VLS_functionalComponentArgsRest(__VLS_357));
    ({}({ modelValue: ((__VLS_ctx.withdrawForm.description)), placeholder: ("可选"), }));
    // @ts-ignore
    [withdrawForm,];
    const __VLS_361 = __VLS_pickFunctionalComponentCtx(__VLS_356, __VLS_358);
    (__VLS_355.slots).default;
    const __VLS_355 = __VLS_pickFunctionalComponentCtx(__VLS_350, __VLS_352);
    (__VLS_325.slots).default;
    const __VLS_325 = __VLS_pickFunctionalComponentCtx(__VLS_320, __VLS_322);
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        (__VLS_319.slots).footer;
        const __VLS_362 = {}.ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        const __VLS_363 = __VLS_asFunctionalComponent(__VLS_362, new __VLS_362({ ...{ 'onClick': {} }, }));
        const __VLS_364 = __VLS_363({ ...{ 'onClick': {} }, }, ...__VLS_functionalComponentArgsRest(__VLS_363));
        ({}({ ...{ 'onClick': {} }, }));
        let __VLS_368;
        const __VLS_369 = {
            onClick: (...[$event]) => {
                __VLS_ctx.withdrawVisible = false;
                // @ts-ignore
                [withdrawVisible,];
            }
        };
        (__VLS_367.slots).default;
        const __VLS_367 = __VLS_pickFunctionalComponentCtx(__VLS_362, __VLS_364);
        let __VLS_365;
        let __VLS_366;
        const __VLS_370 = {}.ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        const __VLS_371 = __VLS_asFunctionalComponent(__VLS_370, new __VLS_370({ ...{ 'onClick': {} }, type: ("primary"), }));
        const __VLS_372 = __VLS_371({ ...{ 'onClick': {} }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_371));
        ({}({ ...{ 'onClick': {} }, type: ("primary"), }));
        let __VLS_376;
        const __VLS_377 = {
            onClick: (__VLS_ctx.withdraw)
        };
        // @ts-ignore
        [withdraw,];
        (__VLS_375.slots).default;
        const __VLS_375 = __VLS_pickFunctionalComponentCtx(__VLS_370, __VLS_372);
        let __VLS_373;
        let __VLS_374;
    }
    const __VLS_319 = __VLS_pickFunctionalComponentCtx(__VLS_314, __VLS_316);
    const __VLS_378 = {}.ElDialog;
    ({}.ElDialog);
    ({}.ElDialog);
    __VLS_components.ElDialog;
    __VLS_components.elDialog;
    __VLS_components.ElDialog;
    __VLS_components.elDialog;
    // @ts-ignore
    [ElDialog, ElDialog,];
    const __VLS_379 = __VLS_asFunctionalComponent(__VLS_378, new __VLS_378({ modelValue: ((__VLS_ctx.exchangeVisible)), title: ("货币兑换"), width: ("400px"), }));
    const __VLS_380 = __VLS_379({ modelValue: ((__VLS_ctx.exchangeVisible)), title: ("货币兑换"), width: ("400px"), }, ...__VLS_functionalComponentArgsRest(__VLS_379));
    ({}({ modelValue: ((__VLS_ctx.exchangeVisible)), title: ("货币兑换"), width: ("400px"), }));
    const __VLS_384 = {}.ElForm;
    ({}.ElForm);
    ({}.ElForm);
    __VLS_components.ElForm;
    __VLS_components.elForm;
    __VLS_components.ElForm;
    __VLS_components.elForm;
    // @ts-ignore
    [ElForm, ElForm,];
    const __VLS_385 = __VLS_asFunctionalComponent(__VLS_384, new __VLS_384({ model: ((__VLS_ctx.exchangeForm)), labelWidth: ("100px"), }));
    const __VLS_386 = __VLS_385({ model: ((__VLS_ctx.exchangeForm)), labelWidth: ("100px"), }, ...__VLS_functionalComponentArgsRest(__VLS_385));
    ({}({ model: ((__VLS_ctx.exchangeForm)), labelWidth: ("100px"), }));
    const __VLS_390 = {}.ElFormItem;
    ({}.ElFormItem);
    ({}.ElFormItem);
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    // @ts-ignore
    [ElFormItem, ElFormItem,];
    const __VLS_391 = __VLS_asFunctionalComponent(__VLS_390, new __VLS_390({ label: ("兑换金额"), required: (true), }));
    const __VLS_392 = __VLS_391({ label: ("兑换金额"), required: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_391));
    ({}({ label: ("兑换金额"), required: (true), }));
    const __VLS_396 = {}.ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    const __VLS_397 = __VLS_asFunctionalComponent(__VLS_396, new __VLS_396({ modelValue: ((__VLS_ctx.exchangeForm.amount)), placeholder: ("请输入兑换金额"), }));
    const __VLS_398 = __VLS_397({ modelValue: ((__VLS_ctx.exchangeForm.amount)), placeholder: ("请输入兑换金额"), }, ...__VLS_functionalComponentArgsRest(__VLS_397));
    ({}({ modelValue: ((__VLS_ctx.exchangeForm.amount)), placeholder: ("请输入兑换金额"), }));
    // @ts-ignore
    [exchangeVisible, exchangeForm, exchangeForm,];
    const __VLS_401 = __VLS_pickFunctionalComponentCtx(__VLS_396, __VLS_398);
    (__VLS_395.slots).default;
    const __VLS_395 = __VLS_pickFunctionalComponentCtx(__VLS_390, __VLS_392);
    const __VLS_402 = {}.ElFormItem;
    ({}.ElFormItem);
    ({}.ElFormItem);
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    // @ts-ignore
    [ElFormItem, ElFormItem,];
    const __VLS_403 = __VLS_asFunctionalComponent(__VLS_402, new __VLS_402({ label: ("源货币"), required: (true), }));
    const __VLS_404 = __VLS_403({ label: ("源货币"), required: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_403));
    ({}({ label: ("源货币"), required: (true), }));
    const __VLS_408 = {}.ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    const __VLS_409 = __VLS_asFunctionalComponent(__VLS_408, new __VLS_408({ modelValue: ((__VLS_ctx.exchangeForm.from_currency)), readonly: (true), }));
    const __VLS_410 = __VLS_409({ modelValue: ((__VLS_ctx.exchangeForm.from_currency)), readonly: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_409));
    ({}({ modelValue: ((__VLS_ctx.exchangeForm.from_currency)), readonly: (true), }));
    // @ts-ignore
    [exchangeForm,];
    const __VLS_413 = __VLS_pickFunctionalComponentCtx(__VLS_408, __VLS_410);
    (__VLS_407.slots).default;
    const __VLS_407 = __VLS_pickFunctionalComponentCtx(__VLS_402, __VLS_404);
    const __VLS_414 = {}.ElFormItem;
    ({}.ElFormItem);
    ({}.ElFormItem);
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    // @ts-ignore
    [ElFormItem, ElFormItem,];
    const __VLS_415 = __VLS_asFunctionalComponent(__VLS_414, new __VLS_414({ label: ("目标货币"), required: (true), }));
    const __VLS_416 = __VLS_415({ label: ("目标货币"), required: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_415));
    ({}({ label: ("目标货币"), required: (true), }));
    const __VLS_420 = {}.ElSelect;
    ({}.ElSelect);
    ({}.ElSelect);
    __VLS_components.ElSelect;
    __VLS_components.elSelect;
    __VLS_components.ElSelect;
    __VLS_components.elSelect;
    // @ts-ignore
    [ElSelect, ElSelect,];
    const __VLS_421 = __VLS_asFunctionalComponent(__VLS_420, new __VLS_420({ modelValue: ((__VLS_ctx.exchangeForm.to_currency)), placeholder: ("选择目标货币"), }));
    const __VLS_422 = __VLS_421({ modelValue: ((__VLS_ctx.exchangeForm.to_currency)), placeholder: ("选择目标货币"), }, ...__VLS_functionalComponentArgsRest(__VLS_421));
    ({}({ modelValue: ((__VLS_ctx.exchangeForm.to_currency)), placeholder: ("选择目标货币"), }));
    const __VLS_426 = {}.ElOption;
    ({}.ElOption);
    __VLS_components.ElOption;
    __VLS_components.elOption;
    // @ts-ignore
    [ElOption,];
    const __VLS_427 = __VLS_asFunctionalComponent(__VLS_426, new __VLS_426({ label: ("CNY"), value: ("CNY"), }));
    const __VLS_428 = __VLS_427({ label: ("CNY"), value: ("CNY"), }, ...__VLS_functionalComponentArgsRest(__VLS_427));
    ({}({ label: ("CNY"), value: ("CNY"), }));
    // @ts-ignore
    [exchangeForm,];
    const __VLS_431 = __VLS_pickFunctionalComponentCtx(__VLS_426, __VLS_428);
    const __VLS_432 = {}.ElOption;
    ({}.ElOption);
    __VLS_components.ElOption;
    __VLS_components.elOption;
    // @ts-ignore
    [ElOption,];
    const __VLS_433 = __VLS_asFunctionalComponent(__VLS_432, new __VLS_432({ label: ("USD"), value: ("USD"), }));
    const __VLS_434 = __VLS_433({ label: ("USD"), value: ("USD"), }, ...__VLS_functionalComponentArgsRest(__VLS_433));
    ({}({ label: ("USD"), value: ("USD"), }));
    const __VLS_437 = __VLS_pickFunctionalComponentCtx(__VLS_432, __VLS_434);
    const __VLS_438 = {}.ElOption;
    ({}.ElOption);
    __VLS_components.ElOption;
    __VLS_components.elOption;
    // @ts-ignore
    [ElOption,];
    const __VLS_439 = __VLS_asFunctionalComponent(__VLS_438, new __VLS_438({ label: ("JPY"), value: ("JPY"), }));
    const __VLS_440 = __VLS_439({ label: ("JPY"), value: ("JPY"), }, ...__VLS_functionalComponentArgsRest(__VLS_439));
    ({}({ label: ("JPY"), value: ("JPY"), }));
    const __VLS_443 = __VLS_pickFunctionalComponentCtx(__VLS_438, __VLS_440);
    const __VLS_444 = {}.ElOption;
    ({}.ElOption);
    __VLS_components.ElOption;
    __VLS_components.elOption;
    // @ts-ignore
    [ElOption,];
    const __VLS_445 = __VLS_asFunctionalComponent(__VLS_444, new __VLS_444({ label: ("EUR"), value: ("EUR"), }));
    const __VLS_446 = __VLS_445({ label: ("EUR"), value: ("EUR"), }, ...__VLS_functionalComponentArgsRest(__VLS_445));
    ({}({ label: ("EUR"), value: ("EUR"), }));
    const __VLS_449 = __VLS_pickFunctionalComponentCtx(__VLS_444, __VLS_446);
    (__VLS_425.slots).default;
    const __VLS_425 = __VLS_pickFunctionalComponentCtx(__VLS_420, __VLS_422);
    (__VLS_419.slots).default;
    const __VLS_419 = __VLS_pickFunctionalComponentCtx(__VLS_414, __VLS_416);
    const __VLS_450 = {}.ElFormItem;
    ({}.ElFormItem);
    ({}.ElFormItem);
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    // @ts-ignore
    [ElFormItem, ElFormItem,];
    const __VLS_451 = __VLS_asFunctionalComponent(__VLS_450, new __VLS_450({ label: ("备注"), }));
    const __VLS_452 = __VLS_451({ label: ("备注"), }, ...__VLS_functionalComponentArgsRest(__VLS_451));
    ({}({ label: ("备注"), }));
    const __VLS_456 = {}.ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    const __VLS_457 = __VLS_asFunctionalComponent(__VLS_456, new __VLS_456({ modelValue: ((__VLS_ctx.exchangeForm.description)), placeholder: ("可选"), }));
    const __VLS_458 = __VLS_457({ modelValue: ((__VLS_ctx.exchangeForm.description)), placeholder: ("可选"), }, ...__VLS_functionalComponentArgsRest(__VLS_457));
    ({}({ modelValue: ((__VLS_ctx.exchangeForm.description)), placeholder: ("可选"), }));
    // @ts-ignore
    [exchangeForm,];
    const __VLS_461 = __VLS_pickFunctionalComponentCtx(__VLS_456, __VLS_458);
    (__VLS_455.slots).default;
    const __VLS_455 = __VLS_pickFunctionalComponentCtx(__VLS_450, __VLS_452);
    (__VLS_389.slots).default;
    const __VLS_389 = __VLS_pickFunctionalComponentCtx(__VLS_384, __VLS_386);
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        (__VLS_383.slots).footer;
        const __VLS_462 = {}.ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        const __VLS_463 = __VLS_asFunctionalComponent(__VLS_462, new __VLS_462({ ...{ 'onClick': {} }, }));
        const __VLS_464 = __VLS_463({ ...{ 'onClick': {} }, }, ...__VLS_functionalComponentArgsRest(__VLS_463));
        ({}({ ...{ 'onClick': {} }, }));
        let __VLS_468;
        const __VLS_469 = {
            onClick: (...[$event]) => {
                __VLS_ctx.exchangeVisible = false;
                // @ts-ignore
                [exchangeVisible,];
            }
        };
        (__VLS_467.slots).default;
        const __VLS_467 = __VLS_pickFunctionalComponentCtx(__VLS_462, __VLS_464);
        let __VLS_465;
        let __VLS_466;
        const __VLS_470 = {}.ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        const __VLS_471 = __VLS_asFunctionalComponent(__VLS_470, new __VLS_470({ ...{ 'onClick': {} }, type: ("primary"), }));
        const __VLS_472 = __VLS_471({ ...{ 'onClick': {} }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_471));
        ({}({ ...{ 'onClick': {} }, type: ("primary"), }));
        let __VLS_476;
        const __VLS_477 = {
            onClick: (__VLS_ctx.exchange)
        };
        // @ts-ignore
        [exchange,];
        (__VLS_475.slots).default;
        const __VLS_475 = __VLS_pickFunctionalComponentCtx(__VLS_470, __VLS_472);
        let __VLS_473;
        let __VLS_474;
    }
    const __VLS_383 = __VLS_pickFunctionalComponentCtx(__VLS_378, __VLS_380);
    const __VLS_478 = {}.ElDialog;
    ({}.ElDialog);
    ({}.ElDialog);
    __VLS_components.ElDialog;
    __VLS_components.elDialog;
    __VLS_components.ElDialog;
    __VLS_components.elDialog;
    // @ts-ignore
    [ElDialog, ElDialog,];
    const __VLS_479 = __VLS_asFunctionalComponent(__VLS_478, new __VLS_478({ modelValue: ((__VLS_ctx.transferVisible)), title: ("转账"), width: ("400px"), }));
    const __VLS_480 = __VLS_479({ modelValue: ((__VLS_ctx.transferVisible)), title: ("转账"), width: ("400px"), }, ...__VLS_functionalComponentArgsRest(__VLS_479));
    ({}({ modelValue: ((__VLS_ctx.transferVisible)), title: ("转账"), width: ("400px"), }));
    const __VLS_484 = {}.ElForm;
    ({}.ElForm);
    ({}.ElForm);
    __VLS_components.ElForm;
    __VLS_components.elForm;
    __VLS_components.ElForm;
    __VLS_components.elForm;
    // @ts-ignore
    [ElForm, ElForm,];
    const __VLS_485 = __VLS_asFunctionalComponent(__VLS_484, new __VLS_484({ model: ((__VLS_ctx.transferForm)), labelWidth: ("100px"), }));
    const __VLS_486 = __VLS_485({ model: ((__VLS_ctx.transferForm)), labelWidth: ("100px"), }, ...__VLS_functionalComponentArgsRest(__VLS_485));
    ({}({ model: ((__VLS_ctx.transferForm)), labelWidth: ("100px"), }));
    const __VLS_490 = {}.ElFormItem;
    ({}.ElFormItem);
    ({}.ElFormItem);
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    // @ts-ignore
    [ElFormItem, ElFormItem,];
    const __VLS_491 = __VLS_asFunctionalComponent(__VLS_490, new __VLS_490({ label: ("转账金额"), required: (true), }));
    const __VLS_492 = __VLS_491({ label: ("转账金额"), required: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_491));
    ({}({ label: ("转账金额"), required: (true), }));
    const __VLS_496 = {}.ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    const __VLS_497 = __VLS_asFunctionalComponent(__VLS_496, new __VLS_496({ modelValue: ((__VLS_ctx.transferForm.amount)), placeholder: ("请输入转账金额"), }));
    const __VLS_498 = __VLS_497({ modelValue: ((__VLS_ctx.transferForm.amount)), placeholder: ("请输入转账金额"), }, ...__VLS_functionalComponentArgsRest(__VLS_497));
    ({}({ modelValue: ((__VLS_ctx.transferForm.amount)), placeholder: ("请输入转账金额"), }));
    // @ts-ignore
    [transferVisible, transferForm, transferForm,];
    const __VLS_501 = __VLS_pickFunctionalComponentCtx(__VLS_496, __VLS_498);
    (__VLS_495.slots).default;
    const __VLS_495 = __VLS_pickFunctionalComponentCtx(__VLS_490, __VLS_492);
    const __VLS_502 = {}.ElFormItem;
    ({}.ElFormItem);
    ({}.ElFormItem);
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    // @ts-ignore
    [ElFormItem, ElFormItem,];
    const __VLS_503 = __VLS_asFunctionalComponent(__VLS_502, new __VLS_502({ label: ("货币类型"), required: (true), }));
    const __VLS_504 = __VLS_503({ label: ("货币类型"), required: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_503));
    ({}({ label: ("货币类型"), required: (true), }));
    const __VLS_508 = {}.ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    const __VLS_509 = __VLS_asFunctionalComponent(__VLS_508, new __VLS_508({ modelValue: ((__VLS_ctx.transferForm.currency_code)), readonly: (true), }));
    const __VLS_510 = __VLS_509({ modelValue: ((__VLS_ctx.transferForm.currency_code)), readonly: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_509));
    ({}({ modelValue: ((__VLS_ctx.transferForm.currency_code)), readonly: (true), }));
    // @ts-ignore
    [transferForm,];
    const __VLS_513 = __VLS_pickFunctionalComponentCtx(__VLS_508, __VLS_510);
    (__VLS_507.slots).default;
    const __VLS_507 = __VLS_pickFunctionalComponentCtx(__VLS_502, __VLS_504);
    const __VLS_514 = {}.ElFormItem;
    ({}.ElFormItem);
    ({}.ElFormItem);
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    // @ts-ignore
    [ElFormItem, ElFormItem,];
    const __VLS_515 = __VLS_asFunctionalComponent(__VLS_514, new __VLS_514({ label: ("收款人"), required: (true), }));
    const __VLS_516 = __VLS_515({ label: ("收款人"), required: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_515));
    ({}({ label: ("收款人"), required: (true), }));
    const __VLS_520 = {}.ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    const __VLS_521 = __VLS_asFunctionalComponent(__VLS_520, new __VLS_520({ modelValue: ((__VLS_ctx.transferForm.to_username)), placeholder: ("请输入收款人用户名或用户ID"), }));
    const __VLS_522 = __VLS_521({ modelValue: ((__VLS_ctx.transferForm.to_username)), placeholder: ("请输入收款人用户名或用户ID"), }, ...__VLS_functionalComponentArgsRest(__VLS_521));
    ({}({ modelValue: ((__VLS_ctx.transferForm.to_username)), placeholder: ("请输入收款人用户名或用户ID"), }));
    // @ts-ignore
    [transferForm,];
    const __VLS_525 = __VLS_pickFunctionalComponentCtx(__VLS_520, __VLS_522);
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("input-tip") }, });
    (__VLS_519.slots).default;
    const __VLS_519 = __VLS_pickFunctionalComponentCtx(__VLS_514, __VLS_516);
    const __VLS_526 = {}.ElFormItem;
    ({}.ElFormItem);
    ({}.ElFormItem);
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    __VLS_components.ElFormItem;
    __VLS_components.elFormItem;
    // @ts-ignore
    [ElFormItem, ElFormItem,];
    const __VLS_527 = __VLS_asFunctionalComponent(__VLS_526, new __VLS_526({ label: ("备注"), }));
    const __VLS_528 = __VLS_527({ label: ("备注"), }, ...__VLS_functionalComponentArgsRest(__VLS_527));
    ({}({ label: ("备注"), }));
    const __VLS_532 = {}.ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    const __VLS_533 = __VLS_asFunctionalComponent(__VLS_532, new __VLS_532({ modelValue: ((__VLS_ctx.transferForm.description)), placeholder: ("可选"), }));
    const __VLS_534 = __VLS_533({ modelValue: ((__VLS_ctx.transferForm.description)), placeholder: ("可选"), }, ...__VLS_functionalComponentArgsRest(__VLS_533));
    ({}({ modelValue: ((__VLS_ctx.transferForm.description)), placeholder: ("可选"), }));
    // @ts-ignore
    [transferForm,];
    const __VLS_537 = __VLS_pickFunctionalComponentCtx(__VLS_532, __VLS_534);
    (__VLS_531.slots).default;
    const __VLS_531 = __VLS_pickFunctionalComponentCtx(__VLS_526, __VLS_528);
    (__VLS_489.slots).default;
    const __VLS_489 = __VLS_pickFunctionalComponentCtx(__VLS_484, __VLS_486);
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        (__VLS_483.slots).footer;
        const __VLS_538 = {}.ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        const __VLS_539 = __VLS_asFunctionalComponent(__VLS_538, new __VLS_538({ ...{ 'onClick': {} }, }));
        const __VLS_540 = __VLS_539({ ...{ 'onClick': {} }, }, ...__VLS_functionalComponentArgsRest(__VLS_539));
        ({}({ ...{ 'onClick': {} }, }));
        let __VLS_544;
        const __VLS_545 = {
            onClick: (...[$event]) => {
                __VLS_ctx.transferVisible = false;
                // @ts-ignore
                [transferVisible,];
            }
        };
        (__VLS_543.slots).default;
        const __VLS_543 = __VLS_pickFunctionalComponentCtx(__VLS_538, __VLS_540);
        let __VLS_541;
        let __VLS_542;
        const __VLS_546 = {}.ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        const __VLS_547 = __VLS_asFunctionalComponent(__VLS_546, new __VLS_546({ ...{ 'onClick': {} }, type: ("primary"), }));
        const __VLS_548 = __VLS_547({ ...{ 'onClick': {} }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_547));
        ({}({ ...{ 'onClick': {} }, type: ("primary"), }));
        let __VLS_552;
        const __VLS_553 = {
            onClick: (__VLS_ctx.transfer)
        };
        // @ts-ignore
        [transfer,];
        (__VLS_551.slots).default;
        const __VLS_551 = __VLS_pickFunctionalComponentCtx(__VLS_546, __VLS_548);
        let __VLS_549;
        let __VLS_550;
    }
    const __VLS_483 = __VLS_pickFunctionalComponentCtx(__VLS_478, __VLS_480);
    (__VLS_11.slots).default;
    const __VLS_11 = __VLS_pickFunctionalComponentCtx(__VLS_6, __VLS_8);
    (__VLS_5.slots).default;
    const __VLS_5 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2);
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses['wallet-container'];
        __VLS_styleScopedClasses['wallet-header'];
        __VLS_styleScopedClasses['wallet-info'];
        __VLS_styleScopedClasses['card-header'];
        __VLS_styleScopedClasses['wallet-details'];
        __VLS_styleScopedClasses['balance-card'];
        __VLS_styleScopedClasses['card-header'];
        __VLS_styleScopedClasses['balance-grid'];
        __VLS_styleScopedClasses['balance-item'];
        __VLS_styleScopedClasses['currency-code'];
        __VLS_styleScopedClasses['amount'];
        __VLS_styleScopedClasses['actions'];
        __VLS_styleScopedClasses['bills-card'];
        __VLS_styleScopedClasses['input-tip'];
    }
    var __VLS_slots;
    return __VLS_slots;
    const __VLS_componentsOption = {};
    let __VLS_name;
    const __VLS_internalComponent = (await import('vue')).defineComponent({
        setup() {
            return {
                wallet: wallet,
                bills: bills,
                createWalletVisible: createWalletVisible,
                editWalletVisible: editWalletVisible,
                depositVisible: depositVisible,
                withdrawVisible: withdrawVisible,
                exchangeVisible: exchangeVisible,
                transferVisible: transferVisible,
                walletForm: walletForm,
                depositForm: depositForm,
                withdrawForm: withdrawForm,
                exchangeForm: exchangeForm,
                transferForm: transferForm,
                createWallet: createWallet,
                deposit: deposit,
                withdraw: withdraw,
                exchange: exchange,
                transfer: transfer,
                startWithdraw: startWithdraw,
                startExchange: startExchange,
                startTransfer: startTransfer,
                formatDate: formatDate,
                getTransactionTypeName: getTransactionTypeName,
                getTransactionTypeColor: getTransactionTypeColor,
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
