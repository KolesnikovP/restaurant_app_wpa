
## Mobile Google Auth (RN)

The backend exposes a mobile auth endpoint that accepts a Google `id_token` and returns an app JWT.

Endpoint
- `POST /auth/google/mobile`

Request body
```
{ "id_token": "<google id token>" }
```

Response
```
{
  "message": " mobile>>>Login successful",
  "user": { "id": 1, "name": "...", "email": "..." },
  "token": "<app_jwt>"
}
```

Required env
- `GOOGLE_ALLOWED_CLIENT_IDS` — comma-separated list of your Google OAuth Client IDs for iOS/Android (and optionally web). Example:
  - `GOOGLE_ALLOWED_CLIENT_IDS=ios-client.apps.googleusercontent.com,android-client.apps.googleusercontent.com`
- `JWT_SECRET` — secret for signing the app JWT.
- Optional: `JWT_TTL_HOURS` — token validity in hours (default 168).

Quick test with curl
```
curl -X POST http://localhost:8080/auth/google/mobile \
  -H 'Content-Type: application/json' \
  -d '{"id_token":"REPLACE_WITH_REAL_ID_TOKEN"}'
```

RN client integration
- After Google sign-in, post the `id_token` to the backend using the fetcher at `rn-client/features/auth/api/mobileAuth.ts` or the hook `useMobileGoogleAuth`.
- Configure the API base via `EXPO_PUBLIC_API_URL` (e.g., `http://localhost:8080`).
## go.mod
file that tracks your dependenies
