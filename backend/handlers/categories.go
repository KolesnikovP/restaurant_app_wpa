package handlers

import (
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

type CreateCategoryRequest struct {
	Name      string `json:"name"`
	Icon      string `json:"icon"`
	SortOrder *int   `json:"sort_order"`
}

func CreateCategoryHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("CREATE CATEGORY HANDLER <<<<<<")

	// get env id from ID
	vars := mux.Vars(r)
	envID := vars["envId"]

	if envID == "" {
		http.Error(w, "environment id is required", http.StatusBadRequest)
		return
	}

	// parse request
	var req CreateCategoryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	// validate request fields
	if req.Name == "" {
		http.Error(w, "name can't be empty", http.StatusBadRequest)
		return
	}

	// validate token
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		http.Error(w, "authrization header required", http.StatusUnauthorized)
		return
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	if tokenString == authHeader {
		http.Error(w, "invalid authrization format", http.StatusUnauthorized)
	}

	claims, err := utils.ValidateJWT(tokenString)
	if err != nil {
		http.Error(w, "invalid token", http.StatusUnauthorized)
		return
	}

	userID := claims.UserID

	/* CHECK user has permission */
	allowedRoles := []string{models.RoleOwner, models.RoleManager}
	userRole, err := utils.CheckUserRole(userID, envID, allowedRoles)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "access denied: not a member of this environment", http.StatusForbidden)
		} else if err.Error() == "insufficient permissions" {
			http.Error(w, fmt.Sprintf("access denied: %s role cannot create categories", userRole), http.StatusForbidden)
		} else {
			http.Error(w, "failed to check permissions", http.StatusInternalServerError)
		}
		return
	}

	fmt.Printf("User %s (role: %s) creating category in env %s\n", userID, userRole, envID)

	// handle optional sort_order
	sortOrder := 0
	if req.SortOrder != nil {
		sortOrder = *req.SortOrder
	} else {
		// Auto-assign: get max sort_order + 1
		var maxSort sql.NullInt64
		err := database.DB.QueryRow(
			"SELECT MAX(sort_order) FROM categories WHERE environment_id = $1",
			envID,
		).Scan(&maxSort)
		if err == nil && maxSort.Valid {
			sortOrder = int(maxSort.Int64) + 1
		}
	}

	// insert category into database
	var category models.Category
	query := `
	INSERT INTO categories (environment_id, name, icon, sort_order, created_at)
	VALUES ($1, $2, $3, $4, NOW())
	RETURNING id, environment_id, name, icon, sort_order, created_at
	`

	err = database.DB.QueryRow(
		query,
		envID,
		req.Name,
		req.Icon,
		sortOrder,
	).Scan(
		&category.ID,
		&category.EnvironmentID,
		&category.Name,
		&category.Icon,
		&category.SortOrder,
		&category.CreatedAt,
	)

	if err != nil {
		fmt.Println("Database error: ", err)
		http.Error(w, "failed to create category", http.StatusInternalServerError)
		return
	}

	// return created category
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(category)
}
