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
	fmt.Printf("token string >>>> %+v", tokenString)
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
	fmt.Printf("Looking for environments with owner_id: %v\n", userID)

	query := `
	SELECT id, name, description FROM environments 
	WHERE owner_id = $1 
	`

	rows, err := database.DB.Query(query, userID)
	if err != nil {
		http.Error(w, "failed to get envs", http.StatusInternalServerError)
		return
	}

	defer rows.Close()

	var environments []models.Environment
	for rows.Next() {
		var env models.Environment
		err := rows.Scan(&env.ID, &env.Name, &env.Description)
		if err != nil {
			fmt.Printf("scan error %v\n", err)
			http.Error(w, "failed to scan envs", http.StatusInternalServerError)
			return
		}
		environments = append(environments, env)
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
