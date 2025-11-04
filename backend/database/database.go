package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
		"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

var DB *sql.DB

func Connect() {

	// get DB credentials from .env
	dbUser := os.Getenv("POSTGRES_USER")
	dbPassword := os.Getenv("POSTGRES_PASSWORD")
	dbName := os.Getenv("POSTGRES_DB")
	dbPort := os.Getenv("DB_EXTERNAL_PORT")


	connectionSring := fmt.Sprintf(
		"host=localhost port=%s user=%s password=%s dbname=%s sslmode=disable",
		dbPort, dbUser, dbPassword, dbName,
		)

	// create connection to db 
	var err error
	DB, err = sql.Open("postgres", connectionSring)
	if err != nil {
		log.Fatal("Error opening db: ", err)
	}

	// test the connection 
	err = DB.Ping()
	if err != nil {
		log.Fatal("Error connection to db: ", err)
	}

 fmt.Println("SUCCESSFULLY connected to DB!!!! ")
}

func RunMigrations() {
	driver, err := postgres.WithInstance(DB, &postgres.Config{})
	if err != nil {
		log.Fatal("Could not create migration driver: ", err)
	}

	m, err := migrate.NewWithDatabaseInstance(
		"file://database/migrations",
		"postgres", driver)
	if err != nil {
		log.Fatal("Migration failed to initialize: ", err)
	}

	// Run all up migrations
	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatal("Migration failed: ", err)
	}

	fmt.Println("✓ Migrations applied successfully!")
}

