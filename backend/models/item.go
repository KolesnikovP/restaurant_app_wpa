package models

import "time"

type Item struct {
	ID         string    `json:"id"`
	CategoryID string    `json:"category_id"`
	Name       string    `json:"name"`
	Content    string    `json:"content"`
	ImageURL   string    `json:"image_url,omitempty"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}
