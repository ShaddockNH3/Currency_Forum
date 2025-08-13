package service

import (
	"exchangeapp/models"
	"exchangeapp/repository"
	"exchangeapp/utils"
	"time"
)

type ExchangeRateService interface {
	Create(exchangeRate *models.ExchangeRate, userID uint) error
	GetByID(id string) (*models.ExchangeRate, error)
	GetAll() ([]models.ExchangeRate, error)
	Update(id string, exchangeRate *models.ExchangeRate, userID uint) error
	Delete(id string, userID uint) error
}

type exchangeRateService struct {
	exchangeRateRepo repository.ExchangeRateRepository
	userRepo         repository.UserRepository
}

func NewExchangeRateService(exchangeRateRepo repository.ExchangeRateRepository, userRepo repository.UserRepository) ExchangeRateService {
	return &exchangeRateService{
		exchangeRateRepo: exchangeRateRepo,
		userRepo:         userRepo,
	}
}

func (s *exchangeRateService) Create(exchangeRate *models.ExchangeRate, userID uint) error {
	// 检查用户是否为管理员
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return err
	}

	if user.Role != "admin" {
		return utils.ErrForbidden
	}

	exchangeRate.Date = time.Now()
	return s.exchangeRateRepo.Create(exchangeRate)
}

func (s *exchangeRateService) GetByID(id string) (*models.ExchangeRate, error) {
	exchangeRate, err := s.exchangeRateRepo.FindByID(id)
	if err != nil {
		return nil, utils.ErrExchangeRateNotFound
	}
	return exchangeRate, nil
}

func (s *exchangeRateService) GetAll() ([]models.ExchangeRate, error) {
	return s.exchangeRateRepo.FindAll()
}

func (s *exchangeRateService) Update(id string, exchangeRate *models.ExchangeRate, userID uint) error {
	// 检查用户是否为管理员
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return err
	}

	if user.Role != "admin" {
		return utils.ErrForbidden
	}

	// 查找现有汇率
	existingRate, err := s.exchangeRateRepo.FindByID(id)
	if err != nil {
		return utils.ErrExchangeRateNotFound
	}

	// 更新字段
	existingRate.FromCurrency = exchangeRate.FromCurrency
	existingRate.ToCurrency = exchangeRate.ToCurrency
	existingRate.Rate = exchangeRate.Rate
	existingRate.Description = exchangeRate.Description

	return s.exchangeRateRepo.Update(existingRate)
}

func (s *exchangeRateService) Delete(id string, userID uint) error {
	// 检查用户是否为管理员
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return err
	}

	if user.Role != "admin" {
		return utils.ErrForbidden
	}

	return s.exchangeRateRepo.Delete(id)
}
