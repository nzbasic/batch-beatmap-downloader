package main

import (
	"github.com/nzbasic/batch-beatmap-downloader/database"
)

func main() {
	defer database.Close()
	database.BatchUpdate(database.AddStream)
}
