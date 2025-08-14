// 基于后端DTO的文章类型定义
export interface ArticleDTO {
    id: number;
    title: string;
    content: string;
    preview: string;
    author_id: number;
    author: string;
    created_at: string;
    updated_at: string;
}

export interface ArticlePageDTO {
    page: number;
    page_size: number;
    total_articles: number;
    items: ArticleDTO[];
}

// 文章输入类型
export interface ArticleInput {
    title: string;
    content: string;
    preview: string;
}

export interface ArticleQueryInput {
    page?: number;
    page_size?: number;
}

// 评论相关类型
export interface CommentDTO {
    id: number;
    content: string;
    created_at: string;
    updated_at: string;
    parent_id?: number;
    article_id: number;
    user_id: number;
    username: string;
    user_role: string;
    replies?: CommentDTO[]; // 添加回复数组
}

export interface CommentListDTO {
    comments: CommentDTO[];
    total: number;
    page: number;
    page_size: number;
    has_more: boolean;
}

export interface CommentInput {
    article_id: number;
    parent_id?: number;
    content: string;
}

export interface Like {
    likes: number;
}

// 为了向后兼容保留原始Article接口
export interface Article {
    ID: number;
    Title: string;
    Preview: string;
    Content: string;
    AuthorID: number;
    Author: string;
    CreatedAt: string;
    UpdatedAt: string;
}