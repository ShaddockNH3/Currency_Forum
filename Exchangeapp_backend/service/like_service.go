package service

import (
	"github.com/go-redis/redis"
)

type LikeService interface {
	LikeArticle(articleID string) error
	GetArticleLikes(articleID string) (string, error)
}

type likeService struct {
	redisDB *redis.Client
}

func NewLikeService(redisDB *redis.Client) LikeService {
	return &likeService{redisDB: redisDB}
}

func (s *likeService) LikeArticle(articleID string) error {
	likeKey := "article:" + articleID + ":likes"
	return s.redisDB.Incr(likeKey).Err()
}

func (s *likeService) GetArticleLikes(articleID string) (string, error) {
	likeKey := "article:" + articleID + ":likes"
	likes, err := s.redisDB.Get(likeKey).Result()
	if err != nil {
		if err.Error() == "redis: nil" {
			return "0", nil
		}
		return "", err
	}
	return likes, nil
}
