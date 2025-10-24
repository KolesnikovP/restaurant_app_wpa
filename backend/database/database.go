package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
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

func CreateTables() {

	// create users table
	createUserQeury := `
	CREATE TABLE IF NOT EXISTS users (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	password_hash TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)`

	_, err := DB.Exec(createUserQeury)
	if err != nil {
		log.Fatal("Error creating table: ", err)
	}

 	fmt.Println("✓ Users table ready!")


	/* fmt.Println("creating a fake user")
 	insertQuery := `
	INSERT INTO users (name, email, password_hash)
	VALUES ($1, $2, $3)
	`

	var userID int 
	err = DB.QueryRow(insertQuery, 
		"admin",
		"admin",
		"admin",
		).Scan(&userID)

	if err != nil {
		log.Fatal("error creating fake user", err)
	}

	fmt.Printf("✓ Fake user created successfully with ID: %d\n", userID) */


// docker exec -it <your-container-name> psql -U postgres -d postgres

	/* // and then we can see all tables \dt
	fmt.Println(" users table created successfully!")

	// insert a user 
	insertQuery := `
	INSERT INTO users (name, email)
	VALUES ($1, $2)
	RETURNING id;
	`

	var userID int
	err = DB.QueryRow(insertQuery, "Petr Kolesnikov", "pe@gmail.com").Scan(&userID)
	if err != nil {
		log.Fatal("error inserting user: ", err)
	}

	fmt.Printf("User inserted successfully with id: %d\n", userID)


	selectQuery := `SELECT id, name, email, created_at FROM users WHERE id = $1`

	var id int
	var name string
	var email string
	var createdAt string

	err = DB.QueryRow(selectQuery, userID).Scan(&id, &name, &email, &createdAt)
	if err != nil {
		log.Fatal("Error querring user: ", err)
	}

	fmt.Println("\n --- User Details ---")
	fmt.Printf("ID: %d\n", id)
	fmt.Printf("name: %s\n", name)
	fmt.Printf("email: %s\n", email)
	fmt.Printf("created at: %s\n", createdAt) */
}
