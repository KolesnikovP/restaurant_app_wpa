# Go Backend

## Prerequisites
- Go installed

## Environment
- `DB_PATH` (default: `app.db`)

## Make Targets
- `make seed` — seed recipes from `cmd/seed/recipes.txt` into the SQLite DB.
  - Example: `make -C go-backend seed`
  - Custom DB: `make -C go-backend seed DB_PATH=dev.db`
- `make run` — start the HTTP server.
  - Example: `make -C go-backend run`
  - Custom DB: `make -C go-backend run DB_PATH=dev.db`
- `make clean-db` — remove the database file.
  - Example: `make -C go-backend clean-db`

## Manual Seeding (without Make)
- From repo root: `DB_PATH=app.db go run ./go-backend/cmd/seed`
- From `go-backend`: `DB_PATH=app.db go run ./cmd/seed`

## Endpoints
- `GET /recipes` — list recipes
- Menu items (existing):
  - `GET /menu-items`
  - `POST /menu-item/create`
  - `PATCH /menu-item/edit/:id`

