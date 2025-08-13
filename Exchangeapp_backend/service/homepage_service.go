package service

import (
	"exchangeapp/dto"
	"exchangeapp/input"
	"exchangeapp/repository"
	"exchangeapp/utils"
)

type HomePageService interface {
	GetHomePage(username string, page, pageSize int) (*dto.HomePageALLDTO, error)
	UpdateUserProfile(username string, profileInput *input.UpdateProfileInput) error
}

type homePageService struct {
	userRepo    repository.UserRepository
	articleRepo repository.ArticleRepository
}

func NewHomePageService(userRepo repository.UserRepository, articleRepo repository.ArticleRepository) HomePageService {
	return &homePageService{
		userRepo:    userRepo,
		articleRepo: articleRepo,
	}
}

func (s *homePageService) GetHomePage(username string, page, pageSize int) (*dto.HomePageALLDTO, error) {
	// 查询用户信息
	user, err := s.userRepo.FindByUsername(username)
	if err != nil {
		return nil, utils.ErrUserNotFound
	}

	// 查询用户文章
	articles, totalArticles, err := s.articleRepo.FindByAuthorID(int(user.ID), page, pageSize)
	if err != nil {
		return nil, err
	}

	// 转换为 DTO
	articleDTOs := utils.ConvertArticlesToDTOs(articles)

	// 构建分页响应
	response := &dto.HomePageALLDTO{
		Username:     user.Username,
		Role:         user.Role,
		Signature:    user.Signature,
		Introduction: user.Introduction,
		Articles: dto.HomePageByPagesDTO{
			Page:          page,
			PageSize:      pageSize,
			TotalArticles: int(totalArticles),
			Items:         articleDTOs,
		},
	}

	return response, nil
}

func (s *homePageService) UpdateUserProfile(username string, profileInput *input.UpdateProfileInput) error {
	// 查找用户
	user, err := s.userRepo.FindByUsername(username)
	if err != nil {
		return utils.ErrUserNotFound
	}

	// 更新用户资料
	if profileInput.Signature != "" {
		user.Signature = profileInput.Signature
	}
	if profileInput.Introduction != "" {
		user.Introduction = profileInput.Introduction
	}

	return s.userRepo.Update(user)
}
