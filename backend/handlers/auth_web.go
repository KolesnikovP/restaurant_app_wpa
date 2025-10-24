package handlers

import (
	"context"
	"encoding/json"
	"io"
	"net/http"

	"backend/config"
	"backend/database"
	"backend/models"

	"golang.org/x/oauth2"
)

func GoogleLogin(w http.ResponseWriter, r *http.Request) {
	url :=config.GoogleOAuthConfig.AuthCodeURL("state-token", oauth2.AccessTypeOffline)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func GoogleCallback(w http.ResponseWriter, r *http.Request) {
	// get the code from url
	code := r.URL.Query().Get("code")
	if code == "" {
		http.Error(w, "code not found", http.StatusBadRequest)
		return
	}

	// exchange code for token
	token, err := config.GoogleOAuthConfig.Exchange(context.Background(), code)
	if err != nil {
		http.Error(w, "Failed to exchange token: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// get user info from Google
	resp, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + token.AccessToken)
	if err != nil {
		http.Error(w, "failed to get user info", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// read response
	data, _ := io.ReadAll(resp.Body)

	// Parse user info
	var googleUser struct {
		Email string `json:"email"`
		Name  string `json:"name"`
	}
	json.Unmarshal(data, &googleUser)

	// check if user exists in db
	var user models.User
	err = database.DB.QueryRow(
		"SELECT id, name, email, created_at FROM users WHERE email = $1",
		googleUser.Email,
	).Scan(&user.ID, &user.Name, &user.Email, &user.CreatedAt)

	// If user doesn't exist, create them
	if err != nil {
		query := `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, created_at`
		err = database.DB.QueryRow(query, googleUser.Name, googleUser.Email).
			Scan(&user.ID, &user.CreatedAt)
		if err != nil {
			http.Error(w, "Failed to create user: "+err.Error(), http.StatusInternalServerError)
			return
		}
		user.Name = googleUser.Name
		user.Email = googleUser.Email
	}

	// Return user info as JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "web: Login successful",
		"user":    user,
	})
}
