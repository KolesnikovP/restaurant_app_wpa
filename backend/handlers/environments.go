package handlers

import (
	/* "backend/database"
	"backend/models" */
	"backend/database"
	"backend/models"
	"backend/utils"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

type CreateEnvironmentRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

func CreateEnvironmentHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("YOU ARE IN THE CreateEnvironmentHandler SON")
	var req CreateEnvironmentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	// validation of required fields
	if req.Name == "" {
		http.Error(w, "name is required", http.StatusBadRequest)
		return
	}

	// get token from Auth header
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		http.Error(w, "Authorization header required", http.StatusUnauthorized)
		return
	}

	// extract token
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	if tokenString == authHeader {
		http.Error(w, "invalid Authorization format", http.StatusUnauthorized)
		return
	}

	// validate token and get user id
	claims, err := utils.ValidateJWT(tokenString)
	if err != nil {
		http.Error(w, "invalid token", http.StatusUnauthorized)
		return
	}

	userID := claims.UserID

	fmt.Println("USER ID IS >>>> %+v <<<<<", userID)

	// inserting into database
	var environment models.Environment
	query := `
		INSERT INTO environments (name, description, owner_id, created_at, updated_at)
	VALUES ($1, $2, $3, NOW(), NOW())
	RETURNING id, name, description, owner_id, created_at, updated_at
	`

	err = database.DB.QueryRow(
		query,
		req.Name,
		req.Description,
		userID,
	).Scan(
		&environment.ID,
		&environment.Name,
		&environment.Description,
		&environment.OwnerID,
		&environment.CreatedAt,
		&environment.UpdatedAt,
	)

	if err != nil {
		http.Error(w, "Failed to create environment", http.StatusInternalServerError)
		return
	}

	// return created environment
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated) // 201
	json.NewEncoder(w).Encode(environment)
}

