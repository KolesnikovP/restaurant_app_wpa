package handlers

import (
	"backend/database"
	"backend/models"
	"backend/utils"
	"encoding/json"
	"fmt"
	"net/http"
)

type LoginUser struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	ID string `json:"id"`
	Token string `json:"token"`
	Email string `json:"email"`
	Name  string `json:"name"`
}

func LoginWithEmailHandler(w http.ResponseWriter, r *http.Request) {
	var loginUser LoginUser
	if err := json.NewDecoder(r.Body).Decode(&loginUser); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}
	fmt.Printf("Here we go!!! user %+v\n", loginUser)

	var userFromDB models.User

	err := database.DB.QueryRow(
		"SELECT id, email, created_at, name, password_hash FROM users WHERE email = $1",
		loginUser.Email).Scan(&userFromDB.ID, &userFromDB.Email, &userFromDB.CreatedAt, &userFromDB.Name, &userFromDB.Password)

	if err != nil {
		fmt.Println("db error: ", err)
		http.Error(w, "user not found", http.StatusNotFound)
		return
	}

	fmt.Printf("A USER FROM db >>>  %+v\n", userFromDB)

	token, err := utils.GenerateJWT(userFromDB.ID, userFromDB.Email)
	if err != nil {
		fmt.Println("token generation error >>>", err)
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	response := LoginResponse {
		Token: token,
		Email: userFromDB.Email,
		Name: userFromDB.Name,
		ID: userFromDB.ID,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
