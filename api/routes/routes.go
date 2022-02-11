package routes

import (
	"github.com/gorilla/mux"
	"github.com/nzbasic/batch-beatmap-downloader/routes/handlers"
)

var Router *mux.Router

func init() {
	Router = mux.NewRouter()
	Router.HandleFunc("/beatmapset/{setId}", handlers.BeatmapDownloadHandler)
	Router.HandleFunc("/beatmapDetails", handlers.BeatmapDetailsHandler)
	Router.HandleFunc("/filter", handlers.FilterHandler)
}
