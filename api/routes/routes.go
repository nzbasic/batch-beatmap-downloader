package routes

import (
	"github.com/gorilla/mux"
	"github.com/nzbasic/batch-beatmap-downloader/api/routes/handlers"
)

var Router *mux.Router

func init() {
	Router = mux.NewRouter()
	Router.HandleFunc("/beatmap/{id}", handlers.BeatmapHandler)
}
