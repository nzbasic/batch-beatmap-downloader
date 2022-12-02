package main

import (
	"github.com/nzbasic/batch-beatmap-downloader/api/database"
)

func main() {
	defer database.Close()
	database.BatchUpdate(database.AddStream)
	database.BatchUpdate(database.AddFileSize)
	database.BatchUpdate(database.AddFarm)
}
