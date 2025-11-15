package handlers

import (
	"backend/database"
	"backend/models"
	"backend/utils"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

func GetEnvironmentsHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("you are in GetEnvironmentsHandler <<<<")

	// get token from Auth header
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		http.Error(w, "Authorization header require", http.StatusUnauthorized)
		return
	}

	fmt.Printf("AUTH HEADER >>>> %+v", authHeader)
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	fmt.Printf("\ntoken string >>>> %+v", tokenString)
	if tokenString == authHeader {
		http.Error(w, "invalid authorization format", http.StatusUnauthorized)
		return
	}

	// validate token and get user id
	claims, err := utils.ValidateJWT(tokenString)
	if err != nil {
		http.Error(w, "invalid token", http.StatusUnauthorized)
		return
	}

	userID := claims.UserID
	fmt.Printf("\nLooking for environments with owner_id: %v\n", userID)

	/* query := `
	SELECT id, name, description FROM environments 
	WHERE owner_id = $1 
	` */
	query := `
	SELECT DISTINCT
		environment.id,
		environment.name,
		environment.description,
		environment.created_at,
		environment.updated_at
	FROM environments environment
	INNER JOIN environment_members member ON environment.id = member.environment_id
	WHERE member.user_id = $1
	ORDER BY environment.created_at DESC
	`

	rows, err := database.DB.Query(query, userID)
	if err != nil {
		http.Error(w, "failed to get envs", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var environments []models.Environment
	for rows.Next() {
		var environment models.Environment
		err := rows.Scan(&environment.ID, &environment.Name, &environment.Description, &environment.CreatedAt, &environment.UpdatedAt)
		if err != nil {
			fmt.Printf("scan error %v\n", err)
			http.Error(w, "failed to scan envs", http.StatusInternalServerError)
			return
		}
		environments = append(environments, environment)
	}

	if err = rows.Err(); err != nil {
		http.Error(w, "error iterating rows", http.StatusInternalServerError)
		return
	}

	fmt.Printf("envs >>>>>>>> %+v", environments)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(environments)
}
