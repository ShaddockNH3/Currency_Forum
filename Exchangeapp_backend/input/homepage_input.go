package input

type UpdateProfileInput struct {
	Signature    string `json:"signature"`
	Introduction string `json:"introduction"`
}

type HomePageQueryInput struct {
	Page     *int `form:"page"`      // 页码，从1开始
	PageSize *int `form:"page_size"` // 每页大小，最大100
}
