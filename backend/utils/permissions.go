package utils

import (
	"backend/database"
	"fmt"
)

func CheckUserRole(userID, environmentID string, allowedRoles []string) (string, error) {
	var role string
	query := `
	SELECT role
	FROM environment_members
	WHERE user_id = $1 AND environment_ID = $2
	`

	err := database.DB.QueryRow(query, userID, environmentID).Scan(&role)
	if err != nil {
		return "", err
	}
	
	//check if user's role is in allowed roles
	for _, allowedRole := range allowedRoles {
		if role == allowedRole {
			return role, nil
		}
	}

	return role, fmt.Errorf("insufficient permissions")
}
