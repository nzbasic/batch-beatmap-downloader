package metrics

import (
	"time"

	"github.com/nzbasic/batch-beatmap-downloader/metrics/store"
)

type CurrentDownload struct {
	Id            string
	TotalSize     int
	Ended         bool
	RemainingSize int
	AverageSpeed  float32
	EstTimeLeft   float32
}

type DailyDownloadStats struct {
	Maps  int
	Size  int
	Speed float32
}

type DownloadMetrics struct {
	CurrentDownloads      []CurrentDownload
	DailyStats            DailyDownloadStats
	CurrentBandwidthUsage float32
}

func GetDownloadMetrics() DownloadMetrics {
	db := store.GetDb()
	timeYesterday := time.Now().Add(-24 * time.Hour)
	timeMinuteAgo := time.Now().Add(-1 * time.Minute)
	var started []store.DownloadStart
	var ended []store.DownloadEnd
	var details []store.BeatmapDownload
	db.All(&started)
	db.All(&ended)
	db.All(&details)

	var current []CurrentDownload
	// go through all downloads, trying to find:
	// currently active downloads (+ associated stats)
	// total beatmap downloads today
	// total size of downloads today
	totalSize := 0
	totalCount := 0
	totalTime := 0
	minuteSize := 0
	minuteTime := 0

	for _, download := range started {
		id := download.DownloadId
		downloadHasEnded := false
		for _, end := range ended {
			if end.DownloadId == download.DownloadId {
				downloadHasEnded = true
				break
			}
		}

		// if download has ended and its older than 24h then not relevant
		if downloadHasEnded && download.CreatedAt.Before(timeYesterday) {
			for _, detail := range details {
				if detail.DownloadId == download.DownloadId {
					db.DeleteStruct(&detail)
				}
			}

			db.DeleteStruct(&download)
			continue
		}

		// // find any completed downloads

		var allDownloaded []store.BeatmapDownload
		for _, detail := range details {
			if detail.DownloadId == download.DownloadId {
				allDownloaded = append(allDownloaded, detail)
			}
		}

		// var allDownloaded []store.BeatmapDownload
		// db.Find("DownloadId", id, &allDownloaded)

		downloadedSize := 0
		downloadedTime := 0
		lastDownloadTime := timeYesterday
		for _, downloaded := range allDownloaded {
			if downloaded.CreatedAt.After(lastDownloadTime) {
				lastDownloadTime = downloaded.CreatedAt
			}

			downloadedSize += downloaded.Size
			downloadedTime += downloaded.Time
			totalCount++

			if downloaded.CreatedAt.After(timeMinuteAgo) {
				minuteSize += downloaded.Size
				minuteTime += downloaded.Time
			}
		}

		if lastDownloadTime.Before(timeMinuteAgo) {
			downloadHasEnded = true
		}

		totalSize += downloadedSize
		totalTime += downloadedTime

		averageSpeed := calculateBandwidth(downloadedSize, downloadedTime)
		remainingSize := download.Size - downloadedSize

		var estTimeLeft float32
		if averageSpeed == 0 {
			estTimeLeft = -1
		} else {
			// remaining size in bytes, average speed in bps, want seconds
			estTimeLeft = float32(remainingSize) / (float32(averageSpeed) / float32(8))
		}

		newCurrent := CurrentDownload{
			Id:            id,
			Ended:         downloadHasEnded,
			TotalSize:     download.Size,
			RemainingSize: download.Size - downloadedSize,
			AverageSpeed:  averageSpeed,
			EstTimeLeft:   estTimeLeft,
		}

		current = append(current, newCurrent)
	}

	daily := DailyDownloadStats{
		Maps:  totalCount,
		Size:  totalSize,
		Speed: calculateBandwidth(totalSize, totalTime),
	}

	currentBandwidth := calculateBandwidth(minuteSize, minuteTime)
	return DownloadMetrics{
		CurrentDownloads:      current,
		CurrentBandwidthUsage: currentBandwidth,
		DailyStats:            daily,
	}
}

func calculateBandwidth(sizeBytes int, timeMs int) float32 {
	var value float32
	if timeMs == 0 || sizeBytes == 0 {
		value = 0
	} else {
		value = float32(sizeBytes*8) / (float32(timeMs) / float32(1000))
	}

	return value
}
