package handlers

import (
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
    "restaurant_app_wpa/go-backend/internal/db"
    "restaurant_app_wpa/go-backend/internal/models"
)

type CreateTaskPayload struct {
    Body     string `json:"body" binding:"required"`
    Priority int    `json:"priority" binding:"required"`
}

func GetTasks(c *gin.Context) {
    var tasks []models.Task
    if err := db.DB.Order("created_at DESC").Find(&tasks).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, tasks)
}

func CreateTask(c *gin.Context) {
    var payload CreateTaskPayload
    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    task := models.Task{Body: payload.Body, Priority: payload.Priority, Completed: false}
    if err := db.DB.Create(&task).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, task)
}

func EditTask(c *gin.Context) {
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
    var task models.Task
    if err := db.DB.First(&task, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "task not found"})
        return
    }
    task.Completed = body.Completed
    if err := db.DB.Save(&task).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, task)
}

