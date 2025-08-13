package utils

import (
	"regexp"
	"strings"
	"unicode"
)

// 正则表达式常量
var (
	UsernameRegex = regexp.MustCompile(`^[a-zA-Z0-9_]{6,20}$`)
	EmailRegex    = regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	PhoneRegex    = regexp.MustCompile(`^1[3-9]\d{9}$`)
)

// ValidationResult 验证结果结构
type ValidationResult struct {
	IsValid bool
	Errors  []string
}

// NewValidationResult 创建新的验证结果
func NewValidationResult() *ValidationResult {
	return &ValidationResult{
		IsValid: true,
		Errors:  make([]string, 0),
	}
}

// AddError 添加验证错误
func (v *ValidationResult) AddError(error string) {
	v.IsValid = false
	v.Errors = append(v.Errors, error)
}

// ValidateUsername 验证用户名
func ValidateUsername(username string) *ValidationResult {
	result := NewValidationResult()
	
	if username == "" {
		result.AddError("用户名不能为空")
		return result
	}
	
	if len(username) < 6 {
		result.AddError("用户名长度不能少于6个字符")
	}
	
	if len(username) > 20 {
		result.AddError("用户名长度不能超过20个字符")
	}
	
	if !UsernameRegex.MatchString(username) {
		result.AddError("用户名只能包含字母、数字和下划线")
	}
	
	return result
}

// ValidatePassword 验证密码
func ValidatePassword(password string) *ValidationResult {
	result := NewValidationResult()
	
	if password == "" {
		result.AddError("密码不能为空")
		return result
	}
	
	if len(password) < 6 {
		result.AddError("密码长度不能少于6个字符")
	}
	
	if len(password) > 20 {
		result.AddError("密码长度不能超过20个字符")
	}
	
	// 检查密码复杂度
	var (
		hasUpper   bool
		hasLower   bool
		hasNumber  bool
	)
	
	for _, char := range password {
		switch {
		case unicode.IsUpper(char):
			hasUpper = true
		case unicode.IsLower(char):
			hasLower = true
		case unicode.IsNumber(char):
			hasNumber = true
		}
	}
	
	if !hasUpper {
		result.AddError("密码必须包含至少一个大写字母")
	}
	
	if !hasLower {
		result.AddError("密码必须包含至少一个小写字母")
	}
	
	if !hasNumber {
		result.AddError("密码必须包含至少一个数字")
	}
	
	return result
}

// ValidateEmail 验证邮箱
func ValidateEmail(email string) *ValidationResult {
	result := NewValidationResult()
	
	if email == "" {
		result.AddError("邮箱不能为空")
		return result
	}
	
	if !EmailRegex.MatchString(email) {
		result.AddError("邮箱格式不正确")
	}
	
	return result
}

// ValidatePhone 验证手机号
func ValidatePhone(phone string) *ValidationResult {
	result := NewValidationResult()
	
	if phone == "" {
		result.AddError("手机号不能为空")
		return result
	}
	
	if !PhoneRegex.MatchString(phone) {
		result.AddError("手机号格式不正确")
	}
	
	return result
}

// ValidateArticleInput 验证文章输入
func ValidateArticleInput(title, content, preview string) *ValidationResult {
	result := NewValidationResult()
	
	if strings.TrimSpace(title) == "" {
		result.AddError("文章标题不能为空")
	}
	
	if len(title) > 100 {
		result.AddError("文章标题不能超过100个字符")
	}
	
	if strings.TrimSpace(content) == "" {
		result.AddError("文章内容不能为空")
	}
	
	if len(content) > 10000 {
		result.AddError("文章内容不能超过10000个字符")
	}
	
	if strings.TrimSpace(preview) == "" {
		result.AddError("文章预览不能为空")
	}
	
	if len(preview) > 200 {
		result.AddError("文章预览不能超过200个字符")
	}
	
	return result
}

// ValidateExchangeRateInput 验证汇率输入
func ValidateExchangeRateInput(fromCurrency, toCurrency string, rate float64) *ValidationResult {
	result := NewValidationResult()
	
	if strings.TrimSpace(fromCurrency) == "" {
		result.AddError("源货币不能为空")
	}
	
	if strings.TrimSpace(toCurrency) == "" {
		result.AddError("目标货币不能为空")
	}
	
	if fromCurrency == toCurrency {
		result.AddError("源货币和目标货币不能相同")
	}
	
	if rate <= 0 {
		result.AddError("汇率必须大于0")
	}
	
	return result
}

// ValidatePagination 验证分页参数
func ValidatePagination(page, pageSize int) *ValidationResult {
	result := NewValidationResult()
	
	if page < 1 {
		result.AddError("页码必须大于0")
	}
	
	if pageSize < 1 {
		result.AddError("每页大小必须大于0")
	}
	
	if pageSize > 100 {
		result.AddError("每页大小不能超过100")
	}
	
	return result
}

// SanitizeString 清理字符串（移除多余空格和特殊字符）
func SanitizeString(input string) string {
	// 移除首尾空格
	trimmed := strings.TrimSpace(input)
	// 移除多余的空格
	cleaned := regexp.MustCompile(`\s+`).ReplaceAllString(trimmed, " ")
	return cleaned
}

// IsEmptyString 检查字符串是否为空或只包含空格
func IsEmptyString(input string) bool {
	return strings.TrimSpace(input) == ""
}
