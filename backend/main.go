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
}
