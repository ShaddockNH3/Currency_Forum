package input

type CommentInput struct {
	ArticleID uint   `json:"article_id" binding:"required"` // 这条评论属于哪篇文章
	ParentID  *uint  `json:"parent_id"`                     // 父级评论ID，如果为空则表示顶级评论（不应该required）
	Content   string `json:"content" binding:"required"`    // 评论的具体内容
}
