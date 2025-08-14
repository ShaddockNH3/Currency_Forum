package dto

import "time"

type CommentDTO struct {
	ID        uint      `json:"id"`         // 评论自己的ID，非常重要！
	Content   string    `json:"content"`    // 评论内容
	CreatedAt time.Time `json:"created_at"` // 发布时间
	UpdatedAt time.Time `json:"updated_at"` // 更新时间
	ParentID  *uint     `json:"parent_id"`  // 它回复了谁
	ArticleID uint      `json:"article_id"` // 属于哪篇文章

	// 用户信息
	UserID   uint   `json:"user_id"`   // 评论作者ID
	Username string `json:"username"`  // 评论作者用户名
	UserRole string `json:"user_role"` // 评论作者角色
}

// CommentListDTO 评论列表响应DTO（支持分页）
type CommentListDTO struct {
	Comments []CommentDTO `json:"comments"`
	Total    int64        `json:"total"`
	Page     int          `json:"page"`
	PageSize int          `json:"page_size"`
	HasMore  bool         `json:"has_more"`
}
