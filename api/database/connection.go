package database

import "database/sql"

var dbLocation = "/home/beatmaps/database.db"

func open() {
	database, _ = sql.Open("sqlite3", dbLocation)
	database.SetMaxOpenConns(1)
}

func Close() {
	database.Close()
}
