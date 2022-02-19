package handlers

import (
	"net/http"
)

type DownloadStart struct {
}

type DownloadEnd struct {
}

type BeatmapDownload struct {
}

func MetricsDownloadStartHandler(w http.ResponseWriter, r *http.Request) {
	var req DownloadStart
	genericJSONDecode(req, r.Body)
	genericJSONSend(w, req)
}

func MetricsDownloadEndHandler(w http.ResponseWriter, r *http.Request) {
	var req DownloadEnd
	genericJSONDecode(req, r.Body)
	genericJSONSend(w, req)
}

func MetricsBeatmapDownloadHandler(w http.ResponseWriter, r *http.Request) {
	var req BeatmapDownload
	genericJSONDecode(req, r.Body)
	genericJSONSend(w, req)
}
