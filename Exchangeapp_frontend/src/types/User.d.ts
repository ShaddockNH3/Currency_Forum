// 用户相关类型定义，基于后端DTO和Input模型

export interface HomePageByPagesDTO {
    page: number;
    page_size: number;
    total_articles: number;
    items: import('./Article').ArticleDTO[];
}

export interface HomePageALLDTO {
    username: string;
    role: string;
    signature: string;
    introduction: string;
    articles: HomePageByPagesDTO;
}

export interface UpdateProfileInput {
    signature?: string;
    introduction?: string;
}

export interface HomePageQueryInput {
    page?: number;
    page_size?: number;
}

export interface UserRegisterInput {
    username: string;
    password: string;
    email: string;
    phone: string;
    role?: string;
}

export interface UserLoginInput {
    loginField: string;
    password: string;
}
