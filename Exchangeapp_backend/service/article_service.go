package service

import (
	"exchangeapp/dto"
	"exchangeapp/input"
	"exchangeapp/models"
	"exchangeapp/repository"
	"exchangeapp/utils"
)

type ArticleService interface {
	Create(articleInput *input.ArticleInput, authorID int, author string) (*dto.ArticleDTO, error)
	GetByID(id string) (*dto.ArticleDTO, error)
	GetAll(page, pageSize int) (*dto.ArticlePageDTO, error)
	GetByAuthorID(authorID int, page, pageSize int) ([]models.Article, int64, error)
	Update(id string, articleInput *input.ArticleInput, userID int, userRole string) error
	Delete(id string, userID int, userRole string) error
}

type articleService struct {
	articleRepo repository.ArticleRepository
}

func NewArticleService(articleRepo repository.ArticleRepository) ArticleService {
	return &articleService{articleRepo: articleRepo}
}

func (s *articleService) Create(articleInput *input.ArticleInput, authorID int, author string) (*dto.ArticleDTO, error) {
	article := &models.Article{
		Title:    articleInput.Title,
		Content:  articleInput.Content,
		Preview:  articleInput.Preview,
		AuthorID: authorID,
		Author:   author,
	}

	if err := s.articleRepo.Create(article); err != nil {
		return nil, err
	}

	response := &dto.ArticleDTO{
		ID:        article.ID,
		Title:     article.Title,
		Content:   article.Content,
		Preview:   article.Preview,
		AuthorID:  int(article.AuthorID),
		Author:    article.Author,
		CreatedAt: article.CreatedAt.Format("2006-01-02 15:04:05"),
		UpdatedAt: article.UpdatedAt.Format("2006-01-02 15:04:05"),
	}

	return response, nil
}

func (s *articleService) GetByID(id string) (*dto.ArticleDTO, error) {
	article, err := s.articleRepo.FindByID(id)
	if err != nil {
		return nil, utils.ErrArticleNotFound
	}
	return utils.ConvertArticleToDTO(article), nil
}

func (s *articleService) GetAll(page, pageSize int) (*dto.ArticlePageDTO, error) {
	articles, total, err := s.articleRepo.FindAll(page, pageSize)
	if err != nil {
		return nil, err
	}

	articleDTOs := utils.ConvertArticlesToDTOs(articles)

	response := &dto.ArticlePageDTO{
		Page:          page,
		PageSize:      pageSize,
		TotalArticles: total,
		Items:         articleDTOs,
	}

	return response, nil
}

func (s *articleService) GetByAuthorID(authorID int, page, pageSize int) ([]models.Article, int64, error) {
	return s.articleRepo.FindByAuthorID(authorID, page, pageSize)
}

func (s *articleService) Update(id string, articleInput *input.ArticleInput, userID int, userRole string) error {
	article, err := s.articleRepo.FindByID(id)
	if err != nil {
		return utils.ErrArticleNotFound
	}

	// 权限检查：只有管理员或文章作者可以编辑文章
	if userRole != "admin" && article.AuthorID != userID {
		return utils.ErrForbidden
	}

	// 更新文章
	article.Title = articleInput.Title
	article.Preview = articleInput.Preview
	article.Content = articleInput.Content

	return s.articleRepo.Update(article)
}

func (s *articleService) Delete(id string, userID int, userRole string) error {
	article, err := s.articleRepo.FindByID(id)
	if err != nil {
		return utils.ErrArticleNotFound
	}

	// 权限检查：只有管理员或文章作者可以删除文章
	if userRole != "admin" && article.AuthorID != userID {
		return utils.ErrForbidden
	}

	return s.articleRepo.Delete(id)
}
