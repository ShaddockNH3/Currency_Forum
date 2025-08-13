package utils

import (
	"errors"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
)

// JWT相关常量
const (
	JWTSecretKey  = "secret" // 在生产环境中应该从环境变量读取
	JWTExpireTime = 72 * time.Hour         // JWT过期时间
)

// JWTClaims JWT声明结构
type JWTClaims struct {
	Username string `json:"username"`
	Role     string `json:"role"`
	UserID   int    `json:"user_id"`
	jwt.StandardClaims
}

// HashPassword 哈希密码
func HashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}

// CheckPassword 验证密码
func CheckPassword(password, hashedPassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}

// GenerateJWT 生成JWT令牌
func GenerateJWT(username, role string, userID int) (string, error) {
	claims := JWTClaims{
		Username: username,
		Role:     role,
		UserID:   userID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(JWTExpireTime).Unix(),
			IssuedAt:  time.Now().Unix(),
			Issuer:    "exchangeapp",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(JWTSecretKey))
}

// ParseJWT 解析JWT令牌
func ParseJWT(tokenString string) (*JWTClaims, error) {
	// 移除Bearer前缀
	if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
		tokenString = tokenString[7:]
	}

	token, err := jwt.ParseWithClaims(tokenString, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(JWTSecretKey), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*JWTClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("invalid token")
}

// ValidateToken 验证令牌是否有效
func ValidateToken(tokenString string) bool {
	_, err := ParseJWT(tokenString)
	return err == nil
}

// GetUserInfoFromContext 从Gin上下文中获取用户信息
func GetUserInfoFromContext(ctx *gin.Context) (userID int, username string, role string, err error) {
	// 尝试从JWT中获取用户信息
	if claims, exists := ctx.Get("jwt_claims"); exists {
		if jwtClaims, ok := claims.(*JWTClaims); ok {
			return jwtClaims.UserID, jwtClaims.Username, jwtClaims.Role, nil
		}
	}

	// 兼容旧的方式，从中间件设置的上下文中获取
	id, exists := ctx.Get("userID")
	if !exists {
		return 0, "", "", ErrUnauthorized
	}

	usernameVal, exists := ctx.Get("username")
	if !exists {
		return 0, "", "", ErrUnauthorized
	}

	roleVal, exists := ctx.Get("role")
	if !exists {
		return 0, "", "", ErrUnauthorized
	}

	// 类型断言
	userIDInt, ok := id.(int)
	if !ok {
		return 0, "", "", ErrUnauthorized
	}

	usernameStr, ok := usernameVal.(string)
	if !ok {
		return 0, "", "", ErrUnauthorized
	}

	roleStr, ok := roleVal.(string)
	if !ok {
		return 0, "", "", ErrUnauthorized
	}

	return userIDInt, usernameStr, roleStr, nil
}

// SetUserInfoToContext 将用户信息设置到Gin上下文中
func SetUserInfoToContext(ctx *gin.Context, userID int, username, role string) {
	ctx.Set("userID", userID)
	ctx.Set("username", username)
	ctx.Set("role", role)
}

// IsAdmin 检查用户是否为管理员
func IsAdmin(role string) bool {
	return role == "admin"
}

// HasPermission 检查用户是否有特定权限
func HasPermission(userRole, requiredRole string) bool {
	if requiredRole == "admin" {
		return userRole == "admin"
	}
	return false // 普通用户权限
}
