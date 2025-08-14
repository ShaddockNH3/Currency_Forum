package dto

type ArticleDTO struct {
	ID        uint   `json:"id"`
	Title     string `json:"title" binding:"required"`
	Content   string `json:"content" binding:"required"`
	Preview   string `json:"preview" binding:"required"`
	AuthorID  int    `json:"author_id" binding:"required"`
	Author    string `json:"author" binding:"required"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

type ArticlePageDTO struct {
	Page          int          `json:"page"`
	PageSize      int          `json:"page_size"`
	TotalArticles int64        `json:"total_articles"`
	Items         []ArticleDTO `json:"items"`
}
