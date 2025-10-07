package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"backend/database"
	"backend/models"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func getUsers(w http.ResponseWriter, r *http.Request) {
	// step 1: query
	rows, err := database.DB.Query("SELECT id, name, email, created_at FROM users")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	defer rows.Close()

	// Step 2: Loop through each row
	users := []models.User{}
	for rows.Next() {
		var user models.User
		err := rows.Scan(&user.ID, &user.Name, &user.Email, &user.CreatedAt)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		users = append(users, user)
	}

	// step 3: send json response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

func createUser(w http.ResponseWriter, r *http.Request) {
	var user models.User

	// Decode json from request body
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Insert into database
	query := `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, created_at`
	err = database.DB.QueryRow(query, user.Name, user.Email).Scan(&user.ID, &user.CreatedAt)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}

func main() {
	err := godotenv.Load()

	if err != nil {
		log.Fatal("Error loading .env file")
	}

	database.Connect()
	defer database.DB.Close() // close when program ends
	database.CreateTables()

	router := mux.NewRouter()
	router.HandleFunc("/users", getUsers).Methods("GET")
	router.HandleFunc("/users", createUser).Methods("POST")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("server starting on http://localhost:%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
