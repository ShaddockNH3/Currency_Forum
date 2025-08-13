package utils

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"math"
	"strconv"
	"strings"
	"time"
)

// GenerateRandomString 生成指定长度的随机字符串
func GenerateRandomString(length int) (string, error) {
	bytes := make([]byte, length/2)
	_, err := rand.Read(bytes)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes)[:length], nil
}

// GenerateUUID 生成简单的UUID（简化版）
func GenerateUUID() string {
	bytes := make([]byte, 16)
	rand.Read(bytes)
	return fmt.Sprintf("%x-%x-%x-%x-%x", bytes[0:4], bytes[4:6], bytes[6:8], bytes[8:10], bytes[10:16])
}

// FormatTime 格式化时间
func FormatTime(t time.Time) string {
	return t.Format("2006-01-02 15:04:05")
}

// FormatDate 格式化日期
func FormatDate(t time.Time) string {
	return t.Format("2006-01-02")
}

// ParseTime 解析时间字符串
func ParseTime(timeStr string) (time.Time, error) {
	return time.Parse("2006-01-02 15:04:05", timeStr)
}

// ParseDate 解析日期字符串
func ParseDate(dateStr string) (time.Time, error) {
	return time.Parse("2006-01-02", dateStr)
}

// IsToday 检查时间是否为今天
func IsToday(t time.Time) bool {
	now := time.Now()
	return t.Year() == now.Year() && t.YearDay() == now.YearDay()
}

// IsYesterday 检查时间是否为昨天
func IsYesterday(t time.Time) bool {
	yesterday := time.Now().AddDate(0, 0, -1)
	return t.Year() == yesterday.Year() && t.YearDay() == yesterday.YearDay()
}

// TimeAgo 计算相对时间
func TimeAgo(t time.Time) string {
	now := time.Now()
	duration := now.Sub(t)
	
	if duration < time.Minute {
		return "刚刚"
	}
	
	if duration < time.Hour {
		minutes := int(duration.Minutes())
		return fmt.Sprintf("%d分钟前", minutes)
	}
	
	if duration < 24*time.Hour {
		hours := int(duration.Hours())
		return fmt.Sprintf("%d小时前", hours)
	}
	
	if duration < 30*24*time.Hour {
		days := int(duration.Hours() / 24)
		return fmt.Sprintf("%d天前", days)
	}
	
	if duration < 12*30*24*time.Hour {
		months := int(duration.Hours() / 24 / 30)
		return fmt.Sprintf("%d个月前", months)
	}
	
	years := int(duration.Hours() / 24 / 365)
	return fmt.Sprintf("%d年前", years)
}

// Paginate 分页计算
func Paginate(page, pageSize, total int) (int, int, int, int) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}
	if pageSize > 100 {
		pageSize = 100
	}
	
	offset := (page - 1) * pageSize
	totalPages := int(math.Ceil(float64(total) / float64(pageSize)))
	
	return page, pageSize, offset, totalPages
}

// StringToInt 字符串转整数
func StringToInt(s string, defaultValue int) int {
	if s == "" {
		return defaultValue
	}
	
	i, err := strconv.Atoi(s)
	if err != nil {
		return defaultValue
	}
	
	return i
}

// StringToFloat 字符串转浮点数
func StringToFloat(s string, defaultValue float64) float64 {
	if s == "" {
		return defaultValue
	}
	
	f, err := strconv.ParseFloat(s, 64)
	if err != nil {
		return defaultValue
	}
	
	return f
}

// IntToString 整数转字符串
func IntToString(i int) string {
	return strconv.Itoa(i)
}

// FloatToString 浮点数转字符串
func FloatToString(f float64, precision int) string {
	return strconv.FormatFloat(f, 'f', precision, 64)
}

// TruncateString 截断字符串
func TruncateString(s string, maxLength int) string {
	if len(s) <= maxLength {
		return s
	}
	
	if maxLength <= 3 {
		return "..."
	}
	
	return s[:maxLength-3] + "..."
}

// CapitalizeFirst 首字母大写
func CapitalizeFirst(s string) string {
	if s == "" {
		return s
	}
	
	return strings.ToUpper(s[:1]) + strings.ToLower(s[1:])
}

// ToSnakeCase 转换为蛇形命名
func ToSnakeCase(s string) string {
	var result strings.Builder
	for i, r := range s {
		if i > 0 && r >= 'A' && r <= 'Z' {
			result.WriteByte('_')
		}
		result.WriteRune(r)
	}
	return strings.ToLower(result.String())
}

// ToCamelCase 转换为驼峰命名
func ToCamelCase(s string) string {
	parts := strings.Split(s, "_")
	for i, part := range parts {
		if i > 0 {
			parts[i] = CapitalizeFirst(part)
		}
	}
	return strings.Join(parts, "")
}

// RemoveSpecialChars 移除特殊字符
func RemoveSpecialChars(s string) string {
	var result strings.Builder
	for _, r := range s {
		if (r >= 'a' && r <= 'z') || (r >= 'A' && r <= 'Z') || (r >= '0' && r <= '9') || r == ' ' {
			result.WriteRune(r)
		}
	}
	return result.String()
}

// MaskEmail 掩码邮箱
func MaskEmail(email string) string {
	if email == "" {
		return email
	}
	
	parts := strings.Split(email, "@")
	if len(parts) != 2 {
		return email
	}
	
	username := parts[0]
	domain := parts[1]
	
	if len(username) <= 2 {
		return email
	}
	
	maskedUsername := username[:1] + "***" + username[len(username)-1:]
	return maskedUsername + "@" + domain
}

// MaskPhone 掩码手机号
func MaskPhone(phone string) string {
	if len(phone) != 11 {
		return phone
	}
	
	return phone[:3] + "****" + phone[7:]
}
