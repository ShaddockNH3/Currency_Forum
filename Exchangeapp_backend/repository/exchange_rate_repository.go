package repository

import (
	"exchangeapp/models"
	"gorm.io/gorm"
)

type ExchangeRateRepository interface {
	Create(exchangeRate *models.ExchangeRate) error
	FindByID(id string) (*models.ExchangeRate, error)
	FindAll() ([]models.ExchangeRate, error)
	Update(exchangeRate *models.ExchangeRate) error
	Delete(id string) error
}

type exchangeRateRepository struct {
	db *gorm.DB
}

func NewExchangeRateRepository(db *gorm.DB) ExchangeRateRepository {
	return &exchangeRateRepository{db: db}
}

func (r *exchangeRateRepository) Create(exchangeRate *models.ExchangeRate) error {
	return r.db.Create(exchangeRate).Error
}

func (r *exchangeRateRepository) FindByID(id string) (*models.ExchangeRate, error) {
	var exchangeRate models.ExchangeRate
	err := r.db.Where("id = ?", id).First(&exchangeRate).Error
	if err != nil {
		return nil, err
	}
	return &exchangeRate, nil
}

func (r *exchangeRateRepository) FindAll() ([]models.ExchangeRate, error) {
	var exchangeRates []models.ExchangeRate
	err := r.db.Find(&exchangeRates).Error
	if err != nil {
		return nil, err
	}
	return exchangeRates, nil
}

func (r *exchangeRateRepository) Update(exchangeRate *models.ExchangeRate) error {
	return r.db.Save(exchangeRate).Error
}

func (r *exchangeRateRepository) Delete(id string) error {
	return r.db.Where("id = ?", id).Delete(&models.ExchangeRate{}).Error
}
