package handlers

import (
	"context"
	"encoding/json"
	"encoding/base64"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"backend/config"
	"backend/database"
	"backend/models"

	"github.com/golang-jwt/jwt/v5"
	"google.golang.org/api/idtoken"
)

// GoogleMobileAuth handles authentication from mobile apps
func GoogleMobileAuth(w http.ResponseWriter, r *http.Request) {
	log.Println("[auth_mobile] request received", r.Method, r.URL.Path)
	var requestBody struct {
		IDToken string `json:"id_token"`
	}

    err := json.NewDecoder(r.Body).Decode(&requestBody)
    if err != nil {
        log.Printf("[auth_mobile] invalid body: %v\n", err)
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusBadRequest)
        json.NewEncoder(w).Encode(map[string]string{"error": "invalid_request_body"})
        return
    }

    if requestBody.IDToken == "" {
        log.Println("[auth_mobile] missing id_token in request")
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusBadRequest)
        json.NewEncoder(w).Encode(map[string]string{"error": "id_token_required"})
        return
    }
	log.Printf("[auth_mobile] id_token received, len=%d\n", len(requestBody.IDToken))

	// Accept multiple client IDs (comma-separated) in GOOGLE_ALLOWED_CLIENT_IDS
	// Fallback to the configured web client ID if none provided
	allowed := os.Getenv("GOOGLE_ALLOWED_CLIENT_IDS")
	audiences := []string{}
	if strings.TrimSpace(allowed) != "" {
		for _, a := range strings.Split(allowed, ",") {
			a = strings.TrimSpace(a)
			if a != "" {
				audiences = append(audiences, a)
			}
		}
	}
	if config.GoogleOAuthConfig != nil && strings.TrimSpace(config.GoogleOAuthConfig.ClientID) != "" {
		audiences = append(audiences, config.GoogleOAuthConfig.ClientID)
	}
	var payload *idtoken.Payload
	var vErr error
	log.Printf("[auth_mobile][trace] about to validate id_token='%s' against %d audiences", requestBody.IDToken[:16]+"...", len(audiences))
    for _, aud := range audiences {
        log.Printf("[auth_mobile] trying audience: %s\n", aud)
        payload, vErr = idtoken.Validate(context.Background(), requestBody.IDToken, aud)
        if vErr == nil {
            log.Printf("[auth_mobile] id_token validated with audience: %s\n", aud)
            break
        }
    }
    if vErr != nil {
        // Try to decode minimally to show aud/iss for debugging
        info := map[string]interface{}{}
        if parts := strings.Split(requestBody.IDToken, "."); len(parts) == 3 {
            if b, decErr := decodeJWTPart(parts[1]); decErr == nil {
                _ = json.Unmarshal(b, &info)
            }
        }
        iss, _ := info["iss"].(string)
        audClaim := info["aud"]
        log.Printf("[auth_mobile] id_token validation failed: %v (iss=%s aud=%v)\n", vErr, iss, audClaim)
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusUnauthorized)
        json.NewEncoder(w).Encode(map[string]interface{}{
            "error": "invalid_id_token",
            "reason": vErr.Error(),
            "iss": iss,
            "aud": audClaim,
            "allowed_audiences": audiences,
        })
        return
    }

	email, _ := payload.Claims["email"].(string)
	name, _ := payload.Claims["name"].(string)
    if email == "" {
        log.Println("[auth_mobile] email missing in token claims")
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusBadRequest)
        json.NewEncoder(w).Encode(map[string]string{"error": "email_missing_in_token"})
        return
    }
	log.Printf("[auth_mobile] token claims email=%s name=%s\n", email, name)

	var user models.User
	err = database.DB.QueryRow(
		"SELECT id, name, email, created_at FROM users WHERE email = $1",
		email,
	).Scan(&user.ID, &user.Name, &user.Email, &user.CreatedAt)

	if err != nil {
		query := `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, created_at`
		err = database.DB.QueryRow(query, name, email).Scan(&user.ID, &user.CreatedAt)
        if err != nil {
            log.Printf("[auth_mobile] failed to create user: %v\n", err)
            w.Header().Set("Content-Type", "application/json")
            w.WriteHeader(http.StatusInternalServerError)
            json.NewEncoder(w).Encode(map[string]string{"error": "failed_to_create_user"})
            return
        }
		user.Name = name
		user.Email = email
		log.Printf("[auth_mobile] created user id=%d email=%s\n", user.ID, email)
	}
	log.Printf("[auth_mobile] user found id=%d email=%s\n", user.ID, user.Email)

	// Issue a short-lived JWT for the client to use
	secret := os.Getenv("JWT_SECRET")
	if strings.TrimSpace(secret) == "" {
		// Dev-friendly default; recommend setting JWT_SECRET in env
		secret = "dev-secret"
	}
	// 7-day expiry by default; can be adjusted via JWT_TTL_HOURS
	ttlHours := 24 * 7
	if v := strings.TrimSpace(os.Getenv("JWT_TTL_HOURS")); v != "" {
		if n, convErr := strconv.Atoi(v); convErr == nil && n > 0 {
			ttlHours = n
		}
	}
	now := time.Now()
	claims := jwt.MapClaims{
		"sub":   strconv.Itoa(user.ID),
		"name":  user.Name,
		"email": user.Email,
		"iat":   now.Unix(),
		"exp":   now.Add(time.Duration(ttlHours) * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, signErr := token.SignedString([]byte(secret))
    if signErr != nil {
        log.Printf("[auth_mobile] jwt sign error: %v\n", signErr)
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusInternalServerError)
        json.NewEncoder(w).Encode(map[string]string{"error": "failed_to_sign_token"})
        return
    }
	log.Printf("[auth_mobile] issued JWT for user id=%d exp=%v\n", user.ID, time.Unix(claims["exp"].(int64), 0))

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": " mobile>>>Login successful",
		"user":    user,
		"token":   signed,
	})
	log.Printf("[auth_mobile] response sent for user id=%d\n", user.ID)
}

// decodeJWTPart decodes a base64url segment of a JWT without padding.
func decodeJWTPart(seg string) ([]byte, error) {
    // Add padding if necessary
    switch len(seg) % 4 {
    case 2:
        seg += "=="
    case 3:
        seg += "="
    }
    return base64.URLEncoding.DecodeString(seg)
}
