package logs

import (
	"database/sql"
	"log"

	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"
)

var logDb *sql.DB

func init() {
	// open db connection to log store
	godotenv.Load()
	//logDb, _ = sql.Open("sqlite3", os.Getenv("LOG_LOCATION"))
}

func Log(logType string, text string) {
	//timeStamp := time.Now().UnixMilli()
	//logDb.Exec("INSERT INTO logs VALUES (?, ?, ?)", timeStamp, logType, text)
	log.Println(text)
}
