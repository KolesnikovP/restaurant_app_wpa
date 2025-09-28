DB_PATH ?= app.db

.PHONY: seed seed-menu run clean-db

seed:
	DB_PATH=$(DB_PATH) go run ./cmd/seed

seed-menu:
	DB_PATH=$(DB_PATH) go run ./cmd/seed_menu

run:
	DB_PATH=$(DB_PATH) go run ./cmd/server

clean-db:
	rm -f $(DB_PATH)
