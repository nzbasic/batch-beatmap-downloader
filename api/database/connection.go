package database

import (
	"database/sql"
	"os"

	"github.com/joho/godotenv"
)

func open() {
	godotenv.Load()
	database, _ = sql.Open("sqlite3", os.Getenv("DB_LOCATION"))
	println("Total Maps:", GetBeatmapCount())
	RefreshFarm()
	BatchUpdate(AddFarm)

	var count int
	row := database.QueryRow("SELECT COUNT(*) FROM beatmaps WHERE farm=1")
	row.Scan(&count)
	println("Farm Maps:", count)

	row = database.QueryRow("SELECT COUNT(*) FROM beatmaps WHERE stream=1")
	row.Scan(&count)
	println("Stream Maps:", count)
}

func Close() {
	database.Close()
}

func Begin() (*sql.Tx, error) {
	return database.Begin()
}
