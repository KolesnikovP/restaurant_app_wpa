FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY . .
RUN go mod download || true
RUN CGO_ENABLED=1 GOOS=linux GOARCH=amd64 go build -o server ./cmd/server

FROM alpine:3.20
WORKDIR /app
ENV PORT=8000 DB_PATH=/app/app.db ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5175
COPY --from=builder /app/server /app/server
EXPOSE 8000
CMD ["/app/server"]

