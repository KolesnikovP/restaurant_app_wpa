package handlers

import (
    "net/http"
    // "strconv"

    "github.com/gin-gonic/gin"
    "restaurant_app_wpa/go-backend/internal/db"
    "restaurant_app_wpa/go-backend/internal/models"
)

func GetRecipes(c *gin.Context) {
    var recipes []models.Recipe
    if err := db.DB.Order("created_at DESC").Find(&recipes).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, recipes)
}
