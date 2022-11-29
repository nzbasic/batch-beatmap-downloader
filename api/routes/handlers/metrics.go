package handlers

import (
	"net/http"
	"time"

	"github.com/nzbasic/batch-beatmap-downloader/metrics"
	metricsstore "github.com/nzbasic/batch-beatmap-downloader/metrics/store"
)

type DownloadStartV2 struct {
	Id          string `json:"id"`
	Client      string `json:"client"`
	SizeRemoved int    `json:"sizeRemoved"`
}

type DownloadUpdateV2 struct {
	Id     string `json:"id"`
	Client string `json:"client"`
	Type   string `json:"type"`
}

type BeatmapDownloadV2 struct {
	Id     string  `json:"id"`
	Client string  `json:"client"`
	SetId  string  `json:"setId"`
	Time   float64 `json:"time"`
}

func Ping(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("alive :)"))
}

func MetricsDownloadStartHandler(w http.ResponseWriter, r *http.Request) {
	var req metricsstore.DownloadStart
	req, _ = genericJSONDecode(req, r.Body)
	req.CreatedAt = time.Now()
	metricsstore.AddMetricData(req)
	genericJSONSend(w, req)
}

func MetricsDownloadEndHandler(w http.ResponseWriter, r *http.Request) {
	var req metricsstore.DownloadEnd
	req, _ = genericJSONDecode(req, r.Body)
	metricsstore.AddMetricData(req)
	genericJSONSend(w, req)
}

func MetricsBeatmapDownloadHandler(w http.ResponseWriter, r *http.Request) {
	var req metricsstore.BeatmapDownload
	req, _ = genericJSONDecode(req, r.Body)
	req.CreatedAt = time.Now()
	metricsstore.AddMetricData(req)
	genericJSONSend(w, req)
}

func MetricsDownloadStartHandlerV2(w http.ResponseWriter, r *http.Request) {
	var req DownloadStartV2
	req, _ = genericJSONDecode(req, r.Body)
	metrics.StartDownload(req.Id, req.Client, req.SizeRemoved)
}

func MetricsDownloadUpdateHandlerV2(w http.ResponseWriter, r *http.Request) {
	var req DownloadUpdateV2
	req, _ = genericJSONDecode(req, r.Body)
	metrics.UpdateDownload(req.Id, req.Client, req.Type)
}

func MetricsBeatmapDownloadHandlerV2(w http.ResponseWriter, r *http.Request) {
	var req BeatmapDownloadV2
	req, _ = genericJSONDecode(req, r.Body)
	metrics.DownloadBeatmap(req.Id, req.Client, req.SetId, req.Time)
}

type MetricsResponse struct {
	Download metrics.DownloadMetrics
	Database metrics.DatabaseMetrics
}

type MetricsResponseV2 struct {
	Download metrics.DownloadMetricsV2
	Database metrics.DatabaseMetrics
}

func MetricsPollHandler(w http.ResponseWriter, r *http.Request) {
	metrics := MetricsResponse{
		Download: metrics.GetDownloadMetrics(),
		Database: metrics.GetDatabaseMetrics(),
	}

	genericJSONSend(w, metrics)
}

func MetricsPollHandlerV2(w http.ResponseWriter, r *http.Request) {
	metrics := MetricsResponseV2{
		Download: metrics.GetDownloadMetricsV2(),
		Database: metrics.GetDatabaseMetrics(),
	}

	genericJSONSend(w, metrics)
}
