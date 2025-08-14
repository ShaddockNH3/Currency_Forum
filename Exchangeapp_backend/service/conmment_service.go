package service

import (
	"exchangeapp/dto"
	"exchangeapp/input"
	"exchangeapp/models"
	"exchangeapp/repository"
	"exchangeapp/utils"
	"strconv"
)

type CommentService interface {
	Create(comment *input.CommentInput, userID uint) error
	FindByArticleID(articleID int) ([]dto.CommentDTO, error)
	FindByArticleIDWithPagination(articleID int, page, pageSize int) (*dto.CommentListDTO, error)
	DeleteByArticleID(articleID int, userID uint, userRole string) error
	FindByParentID(parentID int) ([]dto.CommentDTO, error)
	DeleteByParentID(parentID int, userID uint) error
	DeleteByID(commentID int, userID uint, userRole string) error
}

type commentService struct {
	commentRepo repository.CommentRepository
	userRepo    repository.UserRepository
	articleRepo repository.ArticleRepository
}

func NewCommentService(commentRepo repository.CommentRepository, userRepo repository.UserRepository, articleRepo repository.ArticleRepository) CommentService {
	return &commentService{
		commentRepo: commentRepo,
		userRepo:    userRepo,
		articleRepo: articleRepo,
	}
}

func (s *commentService) Create(comment *input.CommentInput, userID uint) error {
	commentModel := &models.Comment{
		UserID:    userID,
		ArticleID: comment.ArticleID,
		ParentID:  comment.ParentID,
		Content:   comment.Content,
	}
	return s.commentRepo.Create(commentModel)
}

func (s *commentService) FindByArticleID(articleID int) ([]dto.CommentDTO, error) {
	comments, err := s.commentRepo.FindByArticleID(articleID)
	if err != nil {
		return nil, err
	}
	commentDTOs := make([]dto.CommentDTO, len(comments))
	for i, comment := range comments {
		commentDTOs[i] = dto.CommentDTO{
			ID:        comment.ID,
			Content:   comment.Content,
			CreatedAt: comment.CreatedAt,
			UpdatedAt: comment.UpdatedAt,
			ParentID:  comment.ParentID,
			ArticleID: comment.ArticleID,
			UserID:    comment.UserID,
			Username:  comment.User.Username,
			UserRole:  comment.User.Role,
		}
	}
	return commentDTOs, nil
}

// FindByArticleIDWithPagination 分页获取文章评论
func (s *commentService) FindByArticleIDWithPagination(articleID int, page, pageSize int) (*dto.CommentListDTO, error) {
	// 设置默认值和限制
	if page <= 0 {
		page = 1
	}
	if pageSize <= 0 || pageSize > 100 {
		pageSize = 20
	}

	comments, total, err := s.commentRepo.FindByArticleIDWithPagination(articleID, page, pageSize)
	if err != nil {
		return nil, err
	}

	commentDTOs := make([]dto.CommentDTO, len(comments))
	for i, comment := range comments {
		commentDTOs[i] = dto.CommentDTO{
			ID:        comment.ID,
			Content:   comment.Content,
			CreatedAt: comment.CreatedAt,
			UpdatedAt: comment.UpdatedAt,
			ParentID:  comment.ParentID,
			ArticleID: comment.ArticleID,
			UserID:    comment.UserID,
			Username:  comment.User.Username,
			UserRole:  comment.User.Role,
		}
	}

	// 计算是否还有更多页
	hasMore := int64(page*pageSize) < total

	return &dto.CommentListDTO{
		Comments: commentDTOs,
		Total:    total,
		Page:     page,
		PageSize: pageSize,
		HasMore:  hasMore,
	}, nil
}

func (s *commentService) DeleteByArticleID(articleID int, userID uint, userRole string) error {
	article, err := s.articleRepo.FindByID(strconv.Itoa(articleID))
	if err != nil {
		return err
	}
	// 只有管理员或文章作者才能删除文章下的所有评论
	if userRole != "admin" && userID != uint(article.AuthorID) {
		return utils.ErrForbidden
	}
	return s.commentRepo.DeleteByArticleID(articleID)
}

func (s *commentService) FindByParentID(parentID int) ([]dto.CommentDTO, error) {
	comments, err := s.commentRepo.FindByParentID(parentID)
	if err != nil {
		return nil, err
	}
	commentDTOs := make([]dto.CommentDTO, len(comments))
	for i, comment := range comments {
		commentDTOs[i] = dto.CommentDTO{
			ID:        comment.ID,
			Content:   comment.Content,
			CreatedAt: comment.CreatedAt,
			UpdatedAt: comment.UpdatedAt,
			ParentID:  comment.ParentID,
			ArticleID: comment.ArticleID,
			UserID:    comment.UserID,
			Username:  comment.User.Username,
			UserRole:  comment.User.Role,
		}
	}
	return commentDTOs, nil
}

func (s *commentService) DeleteByParentID(parentID int, userID uint) error {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return err
	}
	// 只有管理员才能删除父评论下的所有子评论（这个功能比较危险）
	if user.Role != "admin" {
		return utils.ErrForbidden
	}
	return s.commentRepo.DeleteByParentID(parentID)
}

// DeleteByID 删除单个评论（用户可以删除自己的评论，管理员可以删除任何评论）
func (s *commentService) DeleteByID(commentID int, userID uint, userRole string) error {
	comment, err := s.commentRepo.FindByID(commentID)
	if err != nil {
		return err
	}

	// 用户只能删除自己的评论，管理员可以删除任何评论
	if userRole != "admin" && comment.UserID != userID {
		return utils.ErrForbidden
	}

	return s.commentRepo.DeleteByID(commentID)
}
