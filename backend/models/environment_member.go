package models

import "time"

type EnvironmentMember struct {
	ID            string    `json:"id"`
	EnvironmentID string    `json:"environment_id"`
	UserID        string    `json:"user_id"`
	Role          string    `json:"role"`
	CreatedAt     time.Time `json:"created_at"`
}

// ROLES
const (
	RoleOwner    = "owner"
	RoleManager  = "manager"
	RoleTrainer  = "trainer"
	RoleEmployee = "employee"
	RoleViewer   = "viewer"
)

