# rn-client (Expo + React Native)

Mobile client mirroring the feature-sliced structure used in `frontend`, wired to the `go-backend` REST API.

## Quick start

- Ensure the backend is running locally on `http://localhost:8000` (or set `EXPO_PUBLIC_API_BASE_URL`).
- Install deps:
  - npm: `cd rn-client && npm install`
  - or with Expo-managed versions: `npx expo install`
- Start the app: `npm start`
- Set API URL: copy `.env.example` to `.env` and adjust.

## Env

- `EXPO_PUBLIC_API_BASE_URL` — e.g. `http://localhost:8000`

## Structure

- `src/entities` — business entities and types
- `src/features/<name>/api` — fetchers + hooks (React Query)
- `src/features/<name>/ui` — feature-level UI components
- `src/shared` — shared UI primitives and utilities
- `src/pages` — page-level composition
- `src/app` — app providers and root

