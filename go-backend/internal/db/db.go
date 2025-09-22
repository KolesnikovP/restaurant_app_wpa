package db

import (
    "fmt"
    "log"
    "os"

    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
)

var DB *gorm.DB

func Connect(dbPath string) error {
    database, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
    if err != nil {
        return fmt.Errorf("failed to connect database: %w", err)
    }
    DB = database
    return nil
}

func MustGetEnv(key, def string) string {
    v := os.Getenv(key)
    if v == "" {
        return def
    }
    return v
}

func AutoMigrate(models ...interface{}) {
    if err := DB.AutoMigrate(models...); err != nil {
        log.Fatalf("auto migration failed: %v", err)
    }
}

