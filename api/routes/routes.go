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
	Router.HandleFunc("/metrics/downloadStart", handlers.MetricsDownloadStartHandler)
	Router.HandleFunc("/metrics/downloadEnd", handlers.MetricsDownloadEndHandler)
	Router.HandleFunc("/metrics/beatmapDownload", handlers.MetricsBeatmapDownloadHandler)
	Router.HandleFunc("/metrics", handlers.MetricsPollHandler)
	Router.HandleFunc("/hashMap", handlers.BeatmapHashMap)
	Router.HandleFunc("/totalSize", handlers.CalculateSizeOfBeatmaps)
	Router.HandleFunc("/api", handlers.Ping)

	Router.HandleFunc("/v2/metrics/download/update", handlers.MetricsDownloadUpdateHandlerV2)
	Router.HandleFunc("/v2/metrics/download/start", handlers.MetricsDownloadStartHandlerV2)
	Router.HandleFunc("/v2/metrics/download/beatmap", handlers.MetricsBeatmapDownloadHandlerV2)
	Router.HandleFunc("/v2/metrics", handlers.MetricsPollHandlerV2)
	Router.HandleFunc("/v2/filter", handlers.FilterHandlerV2)
}
