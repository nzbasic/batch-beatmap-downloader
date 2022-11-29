package database

import (
	"database/sql"
	"os"

	"github.com/joho/godotenv"
)

var metaDb *sql.DB
var fullDb *sql.DB

func open() {
	godotenv.Load()
	metaDb, _ = sql.Open("sqlite3", os.Getenv("META_DB_LOCATION"))

	println("Total Maps:", GetBeatmapCount())
	// RefreshFarm()
	// BatchUpdate(AddFarm)

	var count int
	row := metaDb.QueryRow("SELECT COUNT(*) FROM beatmaps WHERE farm=1")
	row.Scan(&count)
	println("Farm Maps:", count)

	row = metaDb.QueryRow("SELECT COUNT(*) FROM beatmaps WHERE stream=1")
	row.Scan(&count)
	println("Stream Maps:", count)
}

func Close() {
	metaDb.Close()
	fullDb.Close()
}

func Begin() (*sql.Tx, error) {
	return metaDb.Begin()
}

func OpenFullDb() {
	fullDb, _ = sql.Open("sqlite3", os.Getenv("FULL_DB_LOCATION"))
}
