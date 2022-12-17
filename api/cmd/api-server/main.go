package main

import (
	"log"
	"net/http"

	"github.com/joho/godotenv"
	"github.com/nzbasic/batch-beatmap-downloader/api/database"
	"github.com/nzbasic/batch-beatmap-downloader/api/database/update"
	"github.com/nzbasic/batch-beatmap-downloader/api/routes"
)

var serverUri = ":7373"

func main() {
	defer database.Close()
	godotenv.Load()

	log.Println("Server listening at " + serverUri)

	go update.UpdateExistingBeatmapsLoop()
	go update.GetNewBeatmapsLoop()

	log.Fatal(http.ListenAndServe(serverUri, routes.Router))
}
