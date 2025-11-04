package handlers

import (
	"encoding/json"
	"net/http"
	"backend/database"
	"backend/models"
)

type CreateEnvironmentRequest struct {
	Name string `json:"name"`
	Description string `json:"description"`
}

func CreateEnvironmentHandler(w http.ResponseWriter, r *http.Request) {

}
