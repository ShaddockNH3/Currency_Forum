package dto

type ArticleDTO struct {
	Title    string `json:"title" binding:"required"`
	Content  string `json:"content" binding:"required"`
	Preview  string `json:"preview" binding:"required"`
	AuthorID int    `json:"author_id" binding:"required"`
	Author   string `json:"author" binding:"required"`
}

type ArticlePageDTO struct {
	Page          int          `json:"page"`
	PageSize      int          `json:"page_size"`
	TotalArticles int64        `json:"total_articles"`
	Items         []ArticleDTO `json:"items"`
}
