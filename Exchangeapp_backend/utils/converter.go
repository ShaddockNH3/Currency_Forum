package utils

import (
	"exchangeapp/dto"
	"exchangeapp/models"
)

// ConvertArticlesToDTOs 将文章模型切片转换为文章DTO切片
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

// ConvertArticleToDTO 将单个文章模型转换为文章DTO
func ConvertArticleToDTO(article *models.Article) *dto.ArticleDTO {
	if article == nil {
		return nil
	}

	return &dto.ArticleDTO{
		Title:    article.Title,
		Content:  article.Content,
		Preview:  article.Preview,
		AuthorID: int(article.AuthorID),
		Author:   article.Author,
	}
}

// ConvertUserToDTO 将用户模型转换为用户DTO
func ConvertUserToDTO(user *models.User) map[string]interface{} {
	if user == nil {
		return nil
	}

	return map[string]interface{}{
		"id":           int(user.ID),
		"username":     user.Username,
		"role":         user.Role,
		"signature":    user.Signature,
		"introduction": user.Introduction,
		"created_at":   user.CreatedAt,
		"updated_at":   user.UpdatedAt,
	}
}

// ConvertUsersToDTOs 将用户模型切片转换为用户DTO切片
func ConvertUsersToDTOs(users []models.User) []map[string]interface{} {
	var userDTOs []map[string]interface{}
	for _, user := range users {
		userDTOs = append(userDTOs, ConvertUserToDTO(&user))
	}
	return userDTOs
}

// ConvertExchangeRateToDTO 将汇率模型转换为汇率DTO
func ConvertExchangeRateToDTO(rate *models.ExchangeRate) map[string]interface{} {
	if rate == nil {
		return nil
	}

	return map[string]interface{}{
		"id":           int(rate.ID),
		"fromCurrency": rate.FromCurrency,
		"toCurrency":   rate.ToCurrency,
		"rate":         rate.Rate,
		"description":  rate.Description,
		"date":         rate.Date,
	}
}

// ConvertExchangeRatesToDTOs 将汇率模型切片转换为汇率DTO切片
func ConvertExchangeRatesToDTOs(rates []models.ExchangeRate) []map[string]interface{} {
	var rateDTOs []map[string]interface{}
	for _, rate := range rates {
		rateDTOs = append(rateDTOs, ConvertExchangeRateToDTO(&rate))
	}
	return rateDTOs
}

// ConvertToHomePageDTO 将用户和文章数据转换为主页DTO
func ConvertToHomePageDTO(user *models.User, articles []models.Article, page, pageSize, totalArticles int) *dto.HomePageALLDTO {
	if user == nil {
		return nil
	}

	articleDTOs := ConvertArticlesToDTOs(articles)

	return &dto.HomePageALLDTO{
		Username:     user.Username,
		Role:         user.Role,
		Signature:    user.Signature,
		Introduction: user.Introduction,
		Articles: dto.HomePageByPagesDTO{
			Page:          page,
			PageSize:      pageSize,
			TotalArticles: totalArticles,
			Items:         articleDTOs,
		},
	}
}

// ConvertToArticlePageDTO 将文章数据和分页信息转换为文章分页DTO
func ConvertToArticlePageDTO(articles []models.Article, page, pageSize int, totalArticles int64) *dto.ArticlePageDTO {
	articleDTOs := ConvertArticlesToDTOs(articles)

	return &dto.ArticlePageDTO{
		Page:          page,
		PageSize:      pageSize,
		TotalArticles: totalArticles,
		Items:         articleDTOs,
	}
}
