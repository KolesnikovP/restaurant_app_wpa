package main

import (
    "bufio"
    "errors"
    "log"
    "os"
    "path/filepath"
    "strings"

    appdb "restaurant_app_wpa/go-backend/internal/db"
    "restaurant_app_wpa/go-backend/internal/models"
    "gorm.io/gorm"
)

// Each block in menu_items.txt is a menu item body:
// First line is a title (we keep it as part of body),
// blocks are separated by lines with just '---'.

func main() {
    dbPath := appdb.MustGetEnv("DB_PATH", "app.db")
    if err := appdb.Connect(dbPath); err != nil {
        log.Fatalf("db connect error: %v", err)
    }

    // ensure table exists
    appdb.AutoMigrate(&models.MenuItem{})

    items, err := loadMenuItems()
    if err != nil {
        log.Fatalf("seed read error: %v", err)
    }

    var inserted, updated, failed int
    for i, body := range items {
        // upsert by exact body match (simple idempotency)
        var existing models.MenuItem
        tx := appdb.DB.Where("body = ?", body).First(&existing)
        if tx.Error == nil {
            existing.Priority = i
            if err := appdb.DB.Save(&existing).Error; err != nil {
                failed++
                log.Printf("update failed: %v", err)
            } else {
                updated++
            }
            continue
        }
        if tx.Error != nil {
            if errors.Is(tx.Error, gorm.ErrRecordNotFound) {
                rec := models.MenuItem{Body: body, Priority: i, Completed: false}
                if err := appdb.DB.Create(&rec).Error; err != nil {
                    failed++
                    log.Printf("insert failed: %v", err)
                } else {
                    inserted++
                }
                continue
            }
            failed++
            log.Printf("lookup failed: %v", tx.Error)
            continue
        }
    }

    log.Printf("menu seed complete: %d processed, %d inserted, %d updated, %d failed", len(items), inserted, updated, failed)
}

func loadMenuItems() ([]string, error) {
    candidates := []string{
        filepath.Join("menu_items.txt"),
        filepath.Join("cmd", "seed", "menu_items.txt"),
        filepath.Join("go-backend", "cmd", "seed", "menu_items.txt"),
    }
    var fp string
    for _, c := range candidates {
        if _, err := os.Stat(c); err == nil {
            fp = c
            break
        }
    }
    if fp == "" {
        return nil, errors.New("menu_items.txt not found")
    }
    f, err := os.Open(fp)
    if err != nil { return nil, err }
    defer f.Close()

    var blocks []string
    var b strings.Builder
    s := bufio.NewScanner(f)
    for s.Scan() {
        line := s.Text()
        if strings.TrimSpace(line) == "---" {
            text := strings.TrimSpace(b.String())
            if text != "" { blocks = append(blocks, text) }
            b.Reset()
            continue
        }
        b.WriteString(line)
        b.WriteString("\n")
    }
    if err := s.Err(); err != nil { return nil, err }
    if strings.TrimSpace(b.String()) != "" { blocks = append(blocks, strings.TrimSpace(b.String())) }

    return blocks, nil
}

