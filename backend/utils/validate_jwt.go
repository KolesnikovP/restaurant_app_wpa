package utils

import "github.com/golang-jwt/jwt/v5"

func ValidateJWT(tokeString string) (*Claims, error) {

	claims := &Claims{}

	token, err := jwt.ParseWithClaims(tokeString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, jwt.ErrSignatureInvalid
	}


	return claims, nil
}
