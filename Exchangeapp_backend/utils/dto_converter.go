package utils

import (
	"exchangeapp/dto"
	"exchangeapp/models"
)

// ConvertArticlesToDTOs 将文章模型转换为 DTO
func ConvertArticlesToDTOs(articles []models.Article) []dto.ArticleDTO {
	var articleDTOs []dto.ArticleDTO
	for _, article := range articles {
		articleDTOs = append(articleDTOs, dto.ArticleDTO{
			Title:    article.Title,
			Content:  article.Content,
			Preview:  article.Preview,
			AuthorID: int(article.AuthorID),
			Author:   article.Author,
		})
	}
	return articleDTOs
}
