#!/bin/sh
set -e

# Default DB_PATH if not provided
: "${DB_PATH:=/tmp/app.db}"

# If no DB exists at DB_PATH, restore the pre-seeded DB
if [ ! -f "$DB_PATH" ] && [ -f "/app/seed/app.db" ]; then
  echo "[entrypoint] Restoring seed database to $DB_PATH"
  mkdir -p "$(dirname "$DB_PATH")"
  cp /app/seed/app.db "$DB_PATH"
fi

exec /app/server

