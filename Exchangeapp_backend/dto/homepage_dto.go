package dto

type HomePageByPagesDTO struct {
	Page int `json:"page"`
	PageSize int `json:"page_size"`
	TotalArticles int `json:"total_articles"`
	Items []ArticleDTO `json:"items"`
}

type HomePageALLDTO struct {
	Username string `json:"username"`
	Role     string `json:"role"`
	Signature string `json:"signature"`
	Introduction string `json:"introduction"`
	Articles HomePageByPagesDTO `json:"articles"`
}