package handlers

import (
	"net/http"

	"github.com/nzbasic/batch-beatmap-downloader/metrics"
)

func MetricsDownloadStartHandler(w http.ResponseWriter, r *http.Request) {
	var req metrics.DownloadStart
	genericJSONDecode(req, r.Body)
	metrics.AddMetricData(req)
	genericJSONSend(w, req)
}

func MetricsDownloadEndHandler(w http.ResponseWriter, r *http.Request) {
	var req metrics.DownloadEnd
	genericJSONDecode(req, r.Body)
	metrics.AddMetricData(req)
	genericJSONSend(w, req)
}

func MetricsBeatmapDownloadHandler(w http.ResponseWriter, r *http.Request) {
	var req metrics.BeatmapDownload
	genericJSONDecode(req, r.Body)
	metrics.AddMetricData(req)
	genericJSONSend(w, req)
}

func MetricsPoll(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte("{}"))
}
