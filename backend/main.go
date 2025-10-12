package main

import (
    "fmt"
    "log"
    "net/http"
    "os"
    "strings"

    "backend/config"
    "backend/database"
    "backend/handlers"

    corsHandlers "github.com/gorilla/handlers"
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
    // Advertise allowed methods and help with 405 handling on preflight
    router.Use(mux.CORSMethodMiddleware(router))

	router.HandleFunc("/users", handlers.GetUsers).Methods("GET")
	router.HandleFunc("/users", handlers.CreateUser).Methods("POST")

	// Web auth routes
	router.HandleFunc("/auth/google/login", handlers.GoogleLogin).Methods("GET")
	router.HandleFunc("/auth/google/callback", handlers.GoogleCallback).Methods("GET")

	// Mobile auth route 
	router.HandleFunc("/auth/google/mobile", handlers.GoogleMobileAuth).Methods("POST")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("✓ Server starting on http://localhost:%s\n", port)
	fmt.Println("✓ Available endpoints:")
	fmt.Println("  - GET  http://localhost:" + port + "/users")
	fmt.Println("  - POST http://localhost:" + port + "/users")
	fmt.Println("  - GET  http://localhost:" + port + "/auth/google/login")
	fmt.Println("  - POST http://localhost:" + port + "/auth/google/mobile")

    // CORS configuration (for web/Expo dev preflights)
    allowed := os.Getenv("ALLOWED_ORIGINS")
    var origins []string
    if strings.TrimSpace(allowed) == "" {
        // Reasonable local defaults for dev (Expo Web / Metro / Vite)
        origins = []string{
            "http://localhost:19006", // Expo web default
            "http://localhost:8081",  // Metro bundler
            "http://localhost:5173",  // Vite
            "http://localhost:5175",  // Vite alt
        }
    } else {
        origins = strings.Split(allowed, ",")
    }
    cors := corsHandlers.CORS(
        corsHandlers.AllowedOrigins(origins),
        corsHandlers.AllowedMethods([]string{http.MethodGet, http.MethodPost, http.MethodPatch, http.MethodOptions}),
        corsHandlers.AllowedHeaders([]string{"Origin", "Content-Type", "Accept", "Authorization"}),
    )

    log.Fatal(http.ListenAndServe(":"+port, cors(router)))
}
