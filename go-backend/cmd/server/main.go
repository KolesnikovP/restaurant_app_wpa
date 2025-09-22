package main

import (
    "log"
    "net/http"
    "strings"

    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
    appdb "restaurant_app_wpa/go-backend/internal/db"
    "restaurant_app_wpa/go-backend/internal/handlers"
    "restaurant_app_wpa/go-backend/internal/models"
)

func main() {
    port := appdb.MustGetEnv("PORT", "8000")
    dbPath := appdb.MustGetEnv("DB_PATH", "app.db")
    allowed := appdb.MustGetEnv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5175")

    if err := appdb.Connect(dbPath); err != nil {
        log.Fatalf("db connect error: %v", err)
    }
    appdb.AutoMigrate(&models.Task{})

    r := gin.Default()

    cfg := cors.DefaultConfig()
    cfg.AllowOrigins = strings.Split(allowed, ",")
    cfg.AllowHeaders = []string{"Origin", "Content-Type", "Accept"}
    cfg.AllowMethods = []string{http.MethodGet, http.MethodPost, http.MethodPatch, http.MethodOptions}
    r.Use(cors.New(cfg))

    r.GET("/tasks", handlers.GetTasks)
    r.POST("/task/create", handlers.CreateTask)
    r.PATCH("/task/edit/:id", handlers.EditTask)

    log.Printf("listening on :%s", port)
    if err := r.Run(":" + port); err != nil {
        log.Fatal(err)
    }
}
