package database

import (
	"database/sql"
	"os"

	"github.com/joho/godotenv"
)

func open() {
	godotenv.Load()
	database, _ = sql.Open("sqlite3", os.Getenv("DB_LOCATION"))

	var count int
	database.QueryRow("SELECT COUNT(*) FROM beatmaps WHERE (Approved = 'ranked')").Scan(&count)
	println(count)

	database.SetMaxOpenConns(1)
}

func Close() {
	database.Close()
}
