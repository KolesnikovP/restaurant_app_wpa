package handlers

import (
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
    "restaurant_app_wpa/go-backend/internal/db"
    "restaurant_app_wpa/go-backend/internal/models"
)

type CreateMenuItemPayload struct {
    Body     string `json:"body" binding:"required"`
    Priority int    `json:"priority" binding:"required"`
}

func GetMenuItems(c *gin.Context) {
    var menuItems []models.MenuItem
    if err := db.DB.Order("created_at DESC").Find(&menuItems).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, menuItems)
}

func CreateMenuItem(c *gin.Context) {
    var payload CreateMenuItemPayload
    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    item := models.MenuItem{Body: payload.Body, Priority: payload.Priority, Completed: false}
    if err := db.DB.Create(&item).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, item)
}

func EditMenuItem(c *gin.Context) {
    idStr := c.Param("id")
    id, err := strconv.Atoi(idStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
        return
    }
    var body struct {
        Completed bool `json:"completed"`
    }
    if err := c.ShouldBindJSON(&body); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    var item models.MenuItem
    if err := db.DB.First(&item, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "menu item not found"})
        return
    }
    item.Completed = body.Completed
    if err := db.DB.Save(&item).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, item)
}
