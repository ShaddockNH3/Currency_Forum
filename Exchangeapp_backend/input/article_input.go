package input

type ArticleInput struct {
	Title   string `json:"title" binding:"required"`
	Content string `json:"content" binding:"required"`
	Preview string `json:"preview" binding:"required"`
}

type ArticleQueryInput struct {
	Page     *int `form:"page"`
	PageSize *int `form:"page_size"`
}
