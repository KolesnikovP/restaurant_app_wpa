Agent working notes for this repo

Scope
- Frontend in `frontend/src` uses a simple feature-sliced structure: `entities`, `features`, `widgets`, `shared`, `pages`, `app`.
- Backend in `go-backend` exposes REST endpoints (Gin + Gorm).

Conventions
- Prefer feature-sliced placement:
  - API: `features/<name>/api` with hooks and fetchers.
- Entity types live under `entities/<name>/model` and are exported via `entities/<name>/index.ts`. Features consume entity types from `@/entities/...`.
- Feature-local types (UI-only) can live under `features/<name>/model`, but business entities belong to `entities`.
  - UI: `features/<name>/ui`.
  - Cross-feature UI primitives live in `shared/ui`.
- Keep fetchers as plain async functions and expose thin hooks that use them. Reason: allows React Query prefetch from non-hook contexts.
- React Query keys are stable, kebab- or snake-cased arrays, e.g. `['recipesData']`, `['menuItems']`.
- Use `staleTime` for fast tab re-entry; avoid aggressive refetches on focus unless explicitly required.

UI
- Use Tailwind utility classes consistent with existing `Layout` styles (dark background, soft borders, rounded corners).
- Reusable containers: implement generic components (e.g., `shared/ui/Card.tsx`) and consume them in feature UIs.

Performance & data
- Prefetch on user intent:
  - Desktop: pointer enter/focus if `(hover: hover)` and not `Save-Data`.
  - Mobile: touchstart/pointerdown if not `Save-Data`.
- Keep payloads small; paginate if lists grow.

Do not
- Do not add global state unless necessary; prefer React Query and local state.
- Do not mix unrelated refactors into focused changes.
- Do not delete commented code unless explicitly requested; preserve existing commented blocks for historical/contextual reference.
