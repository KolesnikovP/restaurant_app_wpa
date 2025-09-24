package models

import "time"

type MenuItem struct {
    ID        uint      `json:"id" gorm:"primaryKey"
`
    Body      string    `json:"body"`
    Priority  int       `json:"priority"`
    Completed bool      `json:"completed"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}

func (MenuItem) TableName() string { return "menu_items" }
