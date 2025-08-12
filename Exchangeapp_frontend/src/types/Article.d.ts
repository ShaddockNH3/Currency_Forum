export interface Article {
    id: number;
    title: string;
    preview: string;
    content: string;
    author_id: number;
    author: string;
    created_at: string;
    updated_at: string;
}

export interface ArticlePage {
    page: number;
    page_size: number;
    total_articles: number;
    items: Article[];
}

export interface Like {
    likes: number;
}

export interface User {
    username: string;
    role: string;
    signature: string;
    introduction: string;
}

export interface HomePageData {
    username: string;
    role: string;
    signature: string;
    introduction: string;
    articles: ArticlePage;
}

export interface Wallet {
    id: number;
    user_id: number;
    username: string;
    status: string;
    is_enabled: boolean;
    wallet_name: string;
    description: string;
    total_balance: string;
    default_currency: string;
    created_at: string;
    updated_at: string;
}

export interface WalletBalance {
    id: number;
    wallet_id: number;
    currency_code: string;
    amount: string;
    is_locked: boolean;
    exchange_rate: string;
    last_updated: number;
    created_at: string;
    updated_at: string;
}

export interface WalletTransaction {
    id: number;
    wallet_id: number;
    transaction_type: string;
    currency_code: string;
    amount: string;
    status: string;
    description: string;
    reference_id: string;
    reference_type: string;
    balance_before: string;
    balance_after: string;
    fee_amount: string;
    fee_currency: string;
    created_at: string;
    updated_at: string;
}

export interface ExchangeRate {
    id: number;
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    description: string;
    date: string;
}