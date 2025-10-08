package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"backend/config"
	"backend/database"
	"backend/models"

	"google.golang.org/api/idtoken"
)

// GoogleMobileAuth handles authentication from mobile apps
func GoogleMobileAuth(w http.ResponseWriter, r *http.Request) {
	var requestBody struct {
		IDToken string `json:"id_token"`
	}

	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if requestBody.IDToken == "" {
		http.Error(w, "ID token is required", http.StatusBadRequest)
		return
	}

	payload, err := idtoken.Validate(context.Background(), requestBody.IDToken, config.GoogleOAuthConfig.ClientID)
	if err != nil {
		http.Error(w, "Invalid ID token: "+err.Error(), http.StatusUnauthorized)
		return
	}

	email := payload.Claims["email"].(string)
	name := payload.Claims["name"].(string)

	var user models.User
	err = database.DB.QueryRow(
		"SELECT id, name, email, created_at FROM users WHERE email = $1",
		email,
	).Scan(&user.ID, &user.Name, &user.Email, &user.CreatedAt)

	if err != nil {
		query := `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, created_at`
		err = database.DB.QueryRow(query, name, email).Scan(&user.ID, &user.CreatedAt)
		if err != nil {
			http.Error(w, "Failed to create user: "+err.Error(), http.StatusInternalServerError)
			return
		}
		user.Name = name
		user.Email = email
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Login successful",
		"user":    user,
	})
}
