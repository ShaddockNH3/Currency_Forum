package models

import "gorm.io/gorm"

type Comment struct {
    gorm.Model
    UserID    uint   // 评论的作者是谁
    User      User   // 关联用户

    ArticleID uint   // 这条评论属于哪篇文章
    ParentID  *uint  // 父级评论ID，如果为空则表示顶级评论
    
    Content   string `gorm:"type:text"` // 评论的具体内容
}
