package main

import (
    "bufio"
    "errors"
    "log"
    "os"
    "path/filepath"
    "strconv"
    "strings"

    appdb "restaurant_app_wpa/go-backend/internal/db"
    "restaurant_app_wpa/go-backend/internal/models"
    "gorm.io/gorm"
)

type seedRecipe struct {
    name       string
    description string
    shelfLife  int
}

func main() {
    dbPath := appdb.MustGetEnv("DB_PATH", "app.db")
    if err := appdb.Connect(dbPath); err != nil {
        log.Fatalf("db connect error: %v", err)
    }

    // ensure table exists
    appdb.AutoMigrate(&models.Recipe{})

    recipes, err := loadFromSeed()
    if err != nil {
        log.Fatalf("seed read error: %v", err)
    }

    var inserted, updated, failed int
    for _, r := range recipes {
        // upsert by recipe_name
        var existing models.Recipe
        tx := appdb.DB.Where("recipe_name = ?", r.name).First(&existing)
        if tx.Error == nil {
            existing.Description = r.description
            existing.Priority = 0
            existing.Completed = false
            // store shelf life inside description as requested field name variant
            if r.shelfLife > 0 {
                // ensure a ShelfLife line exists at the end for quick human reading
                if !strings.Contains(existing.Description, "ShelfLife:") {
                    existing.Description += "\nShelfLife: " + itoa(r.shelfLife) + " days"
                }
            }
            if err := appdb.DB.Save(&existing).Error; err != nil {
                failed++
                log.Printf("update failed for %s: %v", r.name, err)
            } else {
                updated++
            }
            continue
        }
        // handle not found vs other errors
        if tx.Error != nil {
            if errors.Is(tx.Error, gorm.ErrRecordNotFound) {
                desc := r.description
                if r.shelfLife > 0 && !strings.Contains(desc, "ShelfLife:") {
                    desc += "\nShelfLife: " + itoa(r.shelfLife) + " days"
                }
                rec := models.Recipe{
                    RecipeName: r.name,
                    Description: desc,
                    Priority:   0,
                    Completed:  false,
                }
                if err := appdb.DB.Create(&rec).Error; err != nil {
                    failed++
                    log.Printf("insert failed for %s: %v", r.name, err)
                } else {
                    inserted++
                }
                continue
            }
            failed++
            log.Printf("lookup failed for %s: %v", r.name, tx.Error)
            continue
        }
    }

    log.Printf("seeding complete: %d processed, %d inserted, %d updated, %d failed", len(recipes), inserted, updated, failed)
}

func itoa(i int) string { return strconv.Itoa(i) }

// loadFromSeed reads go-backend/@seed/recipes.txt
func loadFromSeed() ([]seedRecipe, error) {
    // resolve relative to this module root (working dir assumed at go-backend or child)
    // Try CWD/@seed and go-backend/@seed
    candidates := []string{
        filepath.Join("recipes.txt"),
        filepath.Join("cmd", "seed", "recipes.txt"),
        filepath.Join("go-backend", "cmd", "seed", "recipes.txt"),
    }
    var fp string
    for _, c := range candidates {
        if _, err := os.Stat(c); err == nil {
            fp = c
            break
        }
    }
    if fp == "" {
        return nil, fmtError("recipes.txt not found in @seed")
    }
    f, err := os.Open(fp)
    if err != nil { return nil, err }
    defer f.Close()

    // File format: blocks separated by lines with just '---'
    // Each block starts with line1=RecipeName, optional line2 'ShelfLife: N', then blank line, then description (rest)
    var blocks []string
    var b strings.Builder
    s := bufio.NewScanner(f)
    for s.Scan() {
        line := s.Text()
        if strings.TrimSpace(line) == "---" {
            blocks = append(blocks, strings.TrimSpace(b.String()))
            b.Reset()
            continue
        }
        b.WriteString(line)
        b.WriteString("\n")
    }
    if err := s.Err(); err != nil { return nil, err }
    if strings.TrimSpace(b.String()) != "" { blocks = append(blocks, strings.TrimSpace(b.String())) }

    out := make([]seedRecipe, 0, len(blocks))
    for _, blk := range blocks {
        lines := strings.Split(blk, "\n")
        if len(lines) == 0 { continue }
        name := strings.TrimSpace(lines[0])
        life := 0
        start := 1
        if len(lines) > 1 && strings.HasPrefix(strings.ToLower(strings.TrimSpace(lines[1])), "shelflife:") {
            // parse int before 'days'
            v := strings.TrimSpace(strings.TrimPrefix(strings.ToLower(lines[1]), "shelflife:"))
            v = strings.TrimSpace(strings.TrimSuffix(v, "days"))
            v = strings.TrimSpace(strings.Fields(v)[0])
            if n, err := strconv.Atoi(v); err == nil { life = n }
            start = 2
        }
        desc := strings.TrimSpace(strings.Join(lines[start:], "\n"))
        // normalize 'Shelf Life' -> 'ShelfLife' inside description only
        desc = strings.ReplaceAll(desc, "Shelf Life", "ShelfLife")
        out = append(out, seedRecipe{name: name, shelfLife: life, description: desc})
    }
    return out, nil
}

// tiny error helper to avoid importing fmt
func fmtError(msg string) error { return errors.New(msg) }
