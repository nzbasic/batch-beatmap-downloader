package handlers

import (
	"net/http"
	"time"

	"github.com/nzbasic/batch-beatmap-downloader/metrics"
	metricsstore "github.com/nzbasic/batch-beatmap-downloader/metrics/store"
)

func MetricsDownloadStartHandler(w http.ResponseWriter, r *http.Request) {
	var req metricsstore.DownloadStart
	req = genericJSONDecode(req, r.Body)
	req.CreatedAt = time.Now()
	metricsstore.AddMetricData(req)
	genericJSONSend(w, req)
}

func MetricsDownloadEndHandler(w http.ResponseWriter, r *http.Request) {
	var req metricsstore.DownloadEnd
	req = genericJSONDecode(req, r.Body)
	metricsstore.AddMetricData(req)
	genericJSONSend(w, req)
}

func MetricsBeatmapDownloadHandler(w http.ResponseWriter, r *http.Request) {
	var req metricsstore.BeatmapDownload
	req = genericJSONDecode(req, r.Body)
	req.CreatedAt = time.Now()
	metricsstore.AddMetricData(req)
	genericJSONSend(w, req)
}

type MetricsResponse struct {
	Download metrics.DownloadMetrics
	Database metrics.DatabaseMetrics
}

func MetricsPollHandler(w http.ResponseWriter, r *http.Request) {
	metrics := MetricsResponse{
		Download: metrics.GetDownloadMetrics(),
		Database: metrics.GetDatabaseMetrics(),
	}

	genericJSONSend(w, metrics)
}
