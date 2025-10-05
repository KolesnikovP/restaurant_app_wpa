# Go Backend

## Prerequisites
- Go installed

## Environment
- `DB_PATH` (default: `app.db`)

## Make Targets
- `make seed` — seed recipes from `cmd/seed/recipes.txt` into the SQLite DB.
  - Example: `make -C go-backend seed`
  - Custom DB: `make -C go-backend seed DB_PATH=dev.db`
- `make seed-menu` — seed menu items from `cmd/seed/menu_items.txt` into the SQLite DB.
  - Example: `make -C go-backend seed-menu`
  - Custom DB: `make -C go-backend seed-menu DB_PATH=dev.db`
- `make run` — start the HTTP server.
  - Example: `make -C go-backend run`
  - Custom DB: `make -C go-backend run DB_PATH=dev.db`
- `make clean-db` — remove the database file.
  - Example: `make -C go-backend clean-db`

## Manual Seeding (without Make)
- From repo root: `DB_PATH=app.db go run ./go-backend/cmd/seed`
- From `go-backend`: `DB_PATH=app.db go run ./cmd/seed`

Menu items seeding:
- From repo root: `DB_PATH=app.db go run ./go-backend/cmd/seed_menu`
- From `go-backend`: `DB_PATH=app.db go run ./cmd/seed_menu`

## Endpoints
- `GET /recipes` — list recipes
- Menu items (existing):
  - `GET /menu-items`
  - `POST /menu-item/create`
  - `PATCH /menu-item/edit/:id`

## Cloud Run Deployment
- Build and push image (replace placeholders):
  - `gcloud builds submit --tag gcr.io/PROJECT_ID/restaurant-api ./go-backend`
- Deploy to Cloud Run:
  - `gcloud run deploy restaurant-api --image gcr.io/PROJECT_ID/restaurant-api --region REGION --allow-unauthenticated --set-env-vars ALLOWED_ORIGINS=https://YOUR-VERCEL-DOMAIN.vercel.app,http://localhost:5173`
- Service details:
  - Dockerfile defaults: `PORT=8080`, `DB_PATH=/tmp/app.db` (ephemeral), `ALLOWED_ORIGINS` for CORS.
  - Cloud Run sets `PORT` automatically; no need to pass it.
  - Writable storage is only `/tmp`; SQLite is not persistent. Use Cloud SQL for production.
- Verify deployment:
  - `curl https://YOUR-CLOUD-RUN-URL/recipes`
  - `curl https://YOUR-CLOUD-RUN-URL/menu-items`

### Demo-friendly seed behavior
- The image includes a pre-seeded SQLite database at `/app/seed/app.db` built during image creation.
- On container start, an entrypoint copies it to `DB_PATH` (default `/tmp/app.db`) if the DB file is missing.
- This ensures non-empty demo data on Cloud Run and local Docker without manual seeding.

### Frontend (Vercel) env
- Set `VITE_API_BASE_URL=https://YOUR-CLOUD-RUN-URL` in Vercel Project → Settings → Environment Variables and redeploy.
