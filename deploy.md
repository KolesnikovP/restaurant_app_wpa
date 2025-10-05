**Overview**
- Frontend (Vite) lives in `frontend/` and deploys to Vercel.
- Backend (Go + Gin + Gorm + SQLite) lives in `go-backend/` and deploys to Google Cloud Run.

**Prereqs**
- Docker installed and working locally.
- Google Cloud SDK (`gcloud`) installed and initialized.
- A Google Cloud project (example: `restaurant-473803`).

**Local Backend (Docker)**
- Build: `docker build -t restaurant-api ./go-backend`
- Run (ephemeral DB): `docker run --rm -p 8080:8080 -e PORT=8080 restaurant-api`
- Test: `curl http://localhost:8080/recipes` and `/menu-items`
- Optional persistent DB:
  - Seed on host: `make -C go-backend seed` and `make -C go-backend seed-menu`
  - Run with host DB mounted: `docker run --rm -p 8080:8080 -e PORT=8080 -e DB_PATH=/tmp/app.db -v "$PWD/go-backend/app.db:/tmp/app.db" restaurant-api`

**Demo Seed Behavior (Image)**
- The Docker image bakes a pre-seeded SQLite DB at `/app/seed/app.db` during build.
- On container start, `entrypoint.sh` copies it to `$DB_PATH` (default `/tmp/app.db`) if missing, then starts the server.
- Cloud Run cold starts will always have demo data; state is not persistent between revisions/instances.

**Cloud Run Deploy (Backend)**
- Set project/region:
  - `gcloud config set project restaurant-473803`
  - `gcloud config set run/region europe-west1` (or your region)
- Enable APIs (one-time):
  - `gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com`
- Build and push image from repo root:
  - `gcloud builds submit --tag gcr.io/restaurant-473803/restaurant-api ./go-backend`
- Deploy service:
  - `gcloud run deploy restaurant-api --image gcr.io/restaurant-473803/restaurant-api --allow-unauthenticated --set-env-vars ALLOWED_ORIGINS=https://YOUR-VERCEL-DOMAIN.vercel.app`
- Get URL:
  - `gcloud run services describe restaurant-api --format='value(status.url)'`
- Defaults baked into the image:
  - `PORT=8080` (Cloud Run injects `PORT` automatically)
  - `DB_PATH=/tmp/app.db` (ephemeral; only `/tmp` is writable)
  - `ALLOWED_ORIGINS` controls CORS (comma-separated origins)

**Vercel Deploy (Frontend)**
- Project directory when prompted: `frontend`
- Environment variable in Vercel (Project → Settings → Environment Variables):
  - `VITE_API_BASE_URL=https://YOUR-CLOUD-RUN-URL`
- Redeploy the frontend. Network requests should target Cloud Run.

**Local Frontend Dev**
- `frontend/.env`:
  - `VITE_API_BASE_URL=http://localhost:8080`
- Run: `cd frontend && npm install && npm run dev`
- Open: `http://localhost:5173`

**CORS**
- Backend allows origins via `ALLOWED_ORIGINS` env (comma-separated):
  - Example: `https://YOUR-VERCEL-DOMAIN.vercel.app,http://localhost:5173`
- Update on Cloud Run:
  - `gcloud run services update restaurant-api --set-env-vars ALLOWED_ORIGINS=https://YOUR-VERCEL-DOMAIN.vercel.app`

**Endpoints**
- `GET /recipes` — list recipes
- `GET /menu-items`
- `POST /menu-item/create`
- `PATCH /menu-item/edit/:id`

**Notes**
- SQLite on Cloud Run is for demos only; move to Cloud SQL for persistence.
- The baked seed DB avoids empty responses on first load; new revisions will reset state to the baked data.
