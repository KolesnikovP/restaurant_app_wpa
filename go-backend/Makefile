DB_PATH ?= app.db

.PHONY: seed run clean-db

seed:
	DB_PATH=$(DB_PATH) go run ./cmd/seed

run:
	DB_PATH=$(DB_PATH) go run ./cmd/server

clean-db:
	rm -f $(DB_PATH)

