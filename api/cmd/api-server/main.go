package main

import (
	"log"
	"net/http"

	"github.com/nzbasic/batch-beatmap-downloader/database"
	"github.com/nzbasic/batch-beatmap-downloader/routes"
)

var serverUri = ":7373"

func main() {
	defer database.Close()
	log.Println("Server listening at " + serverUri)
	log.Fatal(http.ListenAndServe(serverUri, routes.Router))
}
