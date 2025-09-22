.PHONY: run build tidy

run:
	PORT=8000 DB_PATH=app.db ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5175 go run ./cmd/server

build:
	GOOS=linux GOARCH=amd64 go build -o bin/server ./cmd/server

tidy:
	go mod tidy

