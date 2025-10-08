package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"backend/config"
	"backend/database"
	"backend/handlers"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()

	if err != nil {
		log.Fatal("Error loading .env file")
	}

	config.InitOAuth()

	database.Connect()
	defer database.DB.Close() // close when program ends
	database.CreateTables()

	router := mux.NewRouter()

	router.HandleFunc("/users", handlers.GetUsers).Methods("GET")
	router.HandleFunc("/users", handlers.CreateUser).Methods("POST")

	router.HandleFunc("/auth/google/login", handlers.GoogleLogin).Methods("GET")
	router.HandleFunc("/auth/google/callback", handlers.GoogleCallback).Methods("GET")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

		fmt.Printf("✓ Server starting on http://localhost:%s\n", port)
	fmt.Println("✓ Available endpoints:")
	fmt.Println("  - GET  http://localhost:" + port + "/users")
	fmt.Println("  - POST http://localhost:" + port + "/users")
	fmt.Println("  - GET  http://localhost:" + port + "/auth/google/login")

	log.Fatal(http.ListenAndServe(":"+port, router))
}
