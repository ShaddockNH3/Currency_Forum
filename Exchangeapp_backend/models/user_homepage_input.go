package models

type UpdateProfileInput struct {
    Signature    string `json:"signature"`
    Introduction string `json:"introduction"`
}