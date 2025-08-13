package utils

import "errors"

// 业务错误定义
var (
	// 认证相关错误
	ErrInvalidCredentials = errors.New("用户名或密码错误")
	ErrUnauthorized       = errors.New("未授权访问")
	ErrForbidden          = errors.New("没有权限执行此操作")
	ErrTokenExpired       = errors.New("令牌已过期")
	ErrTokenInvalid       = errors.New("令牌无效")

	// 用户相关错误
	ErrUserNotFound      = errors.New("用户不存在")
	ErrUserAlreadyExists = errors.New("用户已存在")
	ErrInvalidUsername   = errors.New("用户名格式无效")
	ErrInvalidPassword   = errors.New("密码格式无效")

	// 文章相关错误
	ErrArticleNotFound      = errors.New("文章不存在")
	ErrArticleAlreadyExists = errors.New("文章已存在")
	ErrInvalidArticleData   = errors.New("文章数据无效")

	// 汇率相关错误
	ErrExchangeRateNotFound = errors.New("汇率不存在")
	ErrInvalidRate          = errors.New("汇率值无效")

	// 系统错误
	ErrDatabaseConnection = errors.New("数据库连接失败")
	ErrRedisConnection    = errors.New("Redis连接失败")
	ErrInternalServer     = errors.New("服务器内部错误")
	ErrInvalidInput       = errors.New("输入参数无效")
)

// 错误类型常量
const (
	ErrorTypeValidation   = "VALIDATION_ERROR"
	ErrorTypeAuth         = "AUTH_ERROR"
	ErrorTypePermission   = "PERMISSION_ERROR"
	ErrorTypeNotFound     = "NOT_FOUND_ERROR"
	ErrorTypeConflict     = "CONFLICT_ERROR"
	ErrorTypeInternal     = "INTERNAL_ERROR"
)

// AppError 应用错误结构
type AppError struct {
	Code       string `json:"code"`
	Message    string `json:"message"`
	Type       string `json:"type"`
	StatusCode int    `json:"-"`
}

// Error 实现error接口
func (e *AppError) Error() string {
	return e.Message
}

// NewAppError 创建新的应用错误
func NewAppError(code, message, errorType string, statusCode int) *AppError {
	return &AppError{
		Code:       code,
		Message:    message,
		Type:       errorType,
		StatusCode: statusCode,
	}
}

// 预定义的常用错误
var (
	ErrBadRequest          = NewAppError("BAD_REQUEST", "请求参数无效", ErrorTypeValidation, 400)
	ErrUnauthorizedAccess  = NewAppError("UNAUTHORIZED", "未授权访问", ErrorTypeAuth, 401)
	ErrForbiddenAccess     = NewAppError("FORBIDDEN", "没有权限执行此操作", ErrorTypePermission, 403)
	ErrResourceNotFound    = NewAppError("NOT_FOUND", "资源不存在", ErrorTypeNotFound, 404)
	ErrConflict            = NewAppError("CONFLICT", "资源冲突", ErrorTypeConflict, 409)
	ErrInternalServerError = NewAppError("INTERNAL_ERROR", "服务器内部错误", ErrorTypeInternal, 500)
)
