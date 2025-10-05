FROM golang:1.23-alpine AS builder
WORKDIR /app
RUN apk add --no-cache build-base sqlite-dev git
COPY go.mod go.sum ./
RUN go mod download
COPY . .
# Build for the native architecture
# to avoid CGO cross-compilation issues
RUN CGO_ENABLED=1 go build -o /app/server ./cmd/server

# Build a demo seed database into /app/seed/app.db
RUN mkdir -p /app/seed \
    && DB_PATH=/app/seed/app.db CGO_ENABLED=1 go run ./cmd/seed \
    && DB_PATH=/app/seed/app.db CGO_ENABLED=1 go run ./cmd/seed_menu

FROM alpine:3.20
WORKDIR /app
RUN apk add --no-cache ca-certificates tzdata sqlite-libs
ENV PORT=8080 DB_PATH=/tmp/app.db ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5175
COPY --from=builder /app/server /app/server
COPY --from=builder /app/seed/app.db /app/seed/app.db

# Copy entrypoint that restores seed DB to /tmp if missing
COPY ./entrypoint.sh /app/entrypoint.sh
RUN chmod 755 /app/entrypoint.sh

EXPOSE 8080
ENTRYPOINT ["/app/entrypoint.sh"]
