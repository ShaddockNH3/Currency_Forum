package repository

import (
	"exchangeapp/models"
	"gorm.io/gorm"
)

type ArticleRepository interface {
	Create(article *models.Article) error
	FindByID(id string) (*models.Article, error)
	FindAll(page, pageSize int) ([]models.Article, int64, error)
	FindByAuthorID(authorID int, page, pageSize int) ([]models.Article, int64, error)
	Update(article *models.Article) error
	Delete(id string) error
	Count() (int64, error)
	CountByAuthorID(authorID int) (int64, error)
}

type articleRepository struct {
	db *gorm.DB
}

func NewArticleRepository(db *gorm.DB) ArticleRepository {
	return &articleRepository{db: db}
}

func (r *articleRepository) Create(article *models.Article) error {
	return r.db.Create(article).Error
}

func (r *articleRepository) FindByID(id string) (*models.Article, error) {
	var article models.Article
	err := r.db.Where("id = ?", id).First(&article).Error
	if err != nil {
		return nil, err
	}
	return &article, nil
}

func (r *articleRepository) FindAll(page, pageSize int) ([]models.Article, int64, error) {
	var articles []models.Article
	var total int64
	
	offset := (page - 1) * pageSize
	
	if err := r.db.Model(&models.Article{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}
	
	if err := r.db.Order("created_at DESC").Offset(offset).Limit(pageSize).Find(&articles).Error; err != nil {
		return nil, 0, err
	}
	
	return articles, total, nil
}

func (r *articleRepository) FindByAuthorID(authorID int, page, pageSize int) ([]models.Article, int64, error) {
	var articles []models.Article
	var total int64
	
	offset := (page - 1) * pageSize
	
	if err := r.db.Model(&models.Article{}).Where("author_id = ?", authorID).Count(&total).Error; err != nil {
		return nil, 0, err
	}
	
	if err := r.db.Where("author_id = ?", authorID).Order("created_at DESC").Offset(offset).Limit(pageSize).Find(&articles).Error; err != nil {
		return nil, 0, err
	}
	
	return articles, total, nil
}

func (r *articleRepository) Update(article *models.Article) error {
	return r.db.Save(article).Error
}

func (r *articleRepository) Delete(id string) error {
	return r.db.Where("id = ?", id).Delete(&models.Article{}).Error
}

func (r *articleRepository) Count() (int64, error) {
	var count int64
	err := r.db.Model(&models.Article{}).Count(&count).Error
	return count, err
}

func (r *articleRepository) CountByAuthorID(authorID int) (int64, error) {
	var count int64
	err := r.db.Model(&models.Article{}).Where("author_id = ?", authorID).Count(&count).Error
	return count, err
}
