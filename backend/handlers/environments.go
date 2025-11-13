package handlers

import (
	/* "backend/database"
	"backend/models" */
	"backend/database"
	"backend/models"
	"backend/utils"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
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

/* GET ENVIRONMENT BY ID HANDLER */
func GetEnvironmentByIDHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Getting environment by ID...")

	// Step 1: Get environment ID from URL
	vars := mux.Vars(r)
	envID := vars["id"]
	if envID == "" {
		http.Error(w, "environment id is required", http.StatusBadRequest)
		return
	}

	// Step 2: Validate token
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		http.Error(w, "Authorization header required", http.StatusUnauthorized)
		return
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	if tokenString == authHeader {
		http.Error(w, "invalid authorization format", http.StatusUnauthorized)
		return
	}

	claims, err := utils.ValidateJWT(tokenString)
	if err != nil {
		http.Error(w, "invalid token", http.StatusUnauthorized)
		return
	}
	userID := claims.UserID

	// Step 3: Get environment and verify ownership
	var env models.EnvironmentWithCategories
	query := `
		SELECT id, name, description, owner_id, created_at, updated_at
		FROM environments
		WHERE id = $1 AND owner_id = $2
	`
	err = database.DB.QueryRow(query, envID, userID).Scan(
		&env.ID, &env.Name, &env.Description,
		&env.OwnerID, &env.CreatedAt, &env.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "environment not found or access denied", http.StatusNotFound)
		} else {
			http.Error(w, "failed to get environment", http.StatusInternalServerError)
		}
		return
	}

	// Step 4: Get categories
	categoryQuery := `
		SELECT id, environment_id, name, icon, sort_order, created_at
		FROM categories
		WHERE environment_id = $1
		ORDER BY sort_order ASC, name ASC
	`
	rows, err := database.DB.Query(categoryQuery, envID)
	if err != nil {
		http.Error(w, "failed to get categories", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	categories := make([]models.Category, 0)
	for rows.Next() {
		var cat models.Category
		err := rows.Scan(&cat.ID, &cat.EnvironmentID, &cat.Name,
			&cat.Icon, &cat.SortOrder, &cat.CreatedAt)
		if err != nil {
			http.Error(w, "failed to scan category", http.StatusInternalServerError)
			return
		}
		categories = append(categories, cat)
	}

	env.Categories = categories

	// Step 5: Return
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(env)
}
