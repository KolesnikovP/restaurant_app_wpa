module backend

go 1.25.1

require github.com/lib/pq v1.10.9 // indirect - driver for posgresql

require github.com/joho/godotenv v1.5.1 // indirect - reading env files

require github.com/gorilla/mux v1.8.1 // a popular HTTP router for Go

require (
	cloud.google.com/go/compute/metadata v0.3.0 // indirect
	golang.org/x/oauth2 v0.31.0 // indirect
)
