package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
  _ "github.com/lib/pq"
)

func main() {
	err := godotenv.Load()

	if err != nil {
		log.Fatal("Error loading .env file")
	}


	// get db credentials from .env
	dbUser := os.Getenv("POSTGRES_USER")
	dbPassword := os.Getenv("POSTGRES_PASSWORD")
	dbName := os.Getenv("POSTGRES_DB")
	dbPort := os.Getenv("DB_EXTERNAL_PORT")


	connectionSring := fmt.Sprintf(
		"host=localhost port=%s user=%s password=%s dbname=%s sslmode=disable",
		dbPort, dbUser, dbPassword, dbName,
		)

	// create connection to db 
	db, err := sql.Open("postgres", connectionSring)
	if err != nil {
		log.Fatal("Error opening db: ", err)
	}

	defer db.Close()


	// test the connection 

	err = db.Ping()
	if err != nil {
		log.Fatal("Error connection to db: ", err)
	}

 fmt.Println("SUCCESSFULLY connected to DB!!!! ")

	// create users table
	createUserQeury := `
	CREATE TABLE IF NOT EXISTS users (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)`

	_, err = db.Exec(createUserQeury)
	if err != nil {
		log.Fatal("Error creating table: ", err)
	}
// docker exec -it <your-container-name> psql -U postgres -d postgres

	// and then we can see all tables \dt
	fmt.Println(" users table created successfully!")
}
