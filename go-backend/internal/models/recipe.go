
package models

import "time"

type Recipe struct {
    ID        uint      `json:"id" gorm:"primaryKey"`
		RecipeName string 	`json:"recipe_name"`
		Description string 	`json:"description"`
		ShelfLife string		`json:"shelf_life"`
    Priority  int       `json:"priority"`
    Completed bool      `json:"completed"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}

func (Recipe) TableName() string { return "recipes" }
