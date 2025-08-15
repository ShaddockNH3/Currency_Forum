// 钱包相关类型定义，基于后端DTO和Input模型

export interface WalletBalanceDTO {
    wallet_id: number;
    currency_code: string;
    amount: string; // 使用string处理decimal类型
    created_at: string;
    updated_at: string;
}

export interface WalletDTO {
    user_id: number;
    username: string;
    status: string;
    wallet_name: string;
    description: string;
    created_at: string;
    updated_at: string;
    default_currency: string;
    balances: WalletBalanceDTO[];
    default_balance?: WalletBalanceDTO;
    bills: BillDTO[];
}

export interface BillDTO {
    id: number;
    created_at: string;
    updated_at: string;
    wallet_id: number;
    transaction_type: string;
    amount: string;
    currency_code: string;
    related_wallet_id: number;
    description: string;
    status: string;
}

export interface TransactionResultDTO {
    transaction_id: string;
    type: string;
    status: string;
    message: string;
    updated_balances: WalletBalanceDTO[];
    created_at: string;
}

export interface ExchangeResultDTO {
    transaction_id: string;
    from_currency: string;
    to_currency: string;
    from_amount: string;
    to_amount: string;
    exchange_rate: string;
    status: string;
    message: string;
    updated_balances: WalletBalanceDTO[];
    created_at: string;
}

export interface TransferResultDTO {
    transaction_id: string;
    from_user_id: number;
    to_user_id: number;
    amount: string;
    currency_code: string;
    status: string;
    message: string;
    created_at: string;
}

// 输入类型
export interface WalletInput {
    wallet_name: string;
    wallet_description: string;
    default_currency: string;
}

export interface WalletBalanceInput {
    currency_code: string;
    amount: string;
}

export interface DepositInput {
    amount: string;
    currency_code: string;
    description?: string;
}

export interface WithdrawInput {
    amount: string;
    currency_code: string;
    description?: string;
}

export interface ExchangeInput {
    amount: string;
    from_currency: string;
    to_currency: string;
    description?: string;
}

export interface TransferInput {
    to_user_id?: number;
    to_username?: string;
    amount: string;
    currency_code: string;
    description?: string;
}
