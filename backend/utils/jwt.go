package utils

import (
	"time"
	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("jwtsecret")

type Claims struct {
	Email string `json:"email"`
	ID string `json:"id"`
	jwt.RegisteredClaims
}
// create a jwt token for a user
func GenerateJWT(userId, email string) (string, error) {

	// expires in 24 hours
	expirationTime := time.Now().Add(24 * time.Hour)
	
	// create a tokenwith user info
	claims := &Claims {
		Email: email,
		ID: userId,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt: jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}
