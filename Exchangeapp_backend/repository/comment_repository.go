package repository

import (
	"exchangeapp/models"

	"gorm.io/gorm"
)

type CommentRepository interface {
	Create(comment *models.Comment) error
	FindByArticleID(articleID int) ([]models.Comment, error)
	FindByArticleIDWithPagination(articleID int, page, pageSize int) ([]models.Comment, int64, error)
	DeleteByArticleID(articleID int) error
	FindByParentID(parentID int) ([]models.Comment, error)
	DeleteByParentID(parentID int) error
	FindByID(commentID int) (*models.Comment, error)
	DeleteByID(commentID int) error
}

type commentRepository struct {
	db *gorm.DB
}

func NewCommentRepository(db *gorm.DB) CommentRepository {
	return &commentRepository{db: db}
}

func (r *commentRepository) Create(comment *models.Comment) error {
	return r.db.Create(comment).Error
}

func (r *commentRepository) FindByArticleID(articleID int) ([]models.Comment, error) {
	list := []models.Comment{}
	err := r.db.Where("article_id = ?", articleID).Preload("User").Order("created_at DESC").Find(&list).Error
	if err != nil {
		return nil, err
	}
	return list, nil
}

func (r *commentRepository) FindByArticleIDWithPagination(articleID int, page, pageSize int) ([]models.Comment, int64, error) {
	var comments []models.Comment
	var total int64

	// 计算总数
	err := r.db.Model(&models.Comment{}).Where("article_id = ?", articleID).Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	// 分页查询
	offset := (page - 1) * pageSize
	err = r.db.Where("article_id = ?", articleID).
		Preload("User").
		Order("created_at DESC").
		Offset(offset).
		Limit(pageSize).
		Find(&comments).Error

	if err != nil {
		return nil, 0, err
	}

	return comments, total, nil
}

func (r *commentRepository) DeleteByArticleID(articleID int) error {
	return r.db.Where("article_id = ?", articleID).Delete(&models.Comment{}).Error
}

func (r *commentRepository) FindByParentID(parentID int) ([]models.Comment, error) {
	list := []models.Comment{}
	err := r.db.Where("parent_id = ?", parentID).Preload("User").Order("created_at ASC").Find(&list).Error
	if err != nil {
		return nil, err
	}
	return list, nil
}

func (r *commentRepository) DeleteByParentID(parentID int) error {
	return r.db.Where("parent_id = ?", parentID).Delete(&models.Comment{}).Error
}

func (r *commentRepository) FindByID(commentID int) (*models.Comment, error) {
	var comment models.Comment
	err := r.db.Preload("User").First(&comment, commentID).Error
	if err != nil {
		return nil, err
	}
	return &comment, nil
}

func (r *commentRepository) DeleteByID(commentID int) error {
	return r.db.Delete(&models.Comment{}, commentID).Error
}
