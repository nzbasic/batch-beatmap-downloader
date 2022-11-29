package metrics

import (
	"time"

	"github.com/nzbasic/batch-beatmap-downloader/metrics/store"
)

func GetDownloadMetricsV2() DownloadMetricsV2 {
	db := store.GetDb()
	timeYesterday := time.Now().Add(-24 * time.Hour)
	timeMinuteAgo := time.Now().Add(-1 * time.Minute)

	var downloads []store.DownloadV2
	db.All(&downloads)

	var current []CurrentDownloadV2
	// go through all downloads, trying to find:
	// currently active downloads (+ associated stats)
	// total beatmap downloads today
	// total size of downloads today
	// total speed of downloads today
	totalSize := 0
	totalSpeed := 0
	totalFinished := 0
	totalSets := 0
	totalBandwidth := 0
	totalMinuteBandwidth := 0

	countMinute := 0
	countDay := 0

	for _, download := range downloads {
		if download.LastUpdate.Before(timeYesterday) {
			continue
		}

		if download.Started && download.LastUpdate.After(timeMinuteAgo) {
			current = append(current, CurrentDownloadV2{
				Size:     download.Size,
				Progress: download.Progress,
				Speed:    download.Speed,
				Active:   download.Active,
				Finished: download.Finished,
			})

			countMinute++
			totalBandwidth += download.Speed
			totalMinuteBandwidth += download.Speed
		}

		if download.Finished {
			totalFinished++
		}

		countDay++
		totalSize += download.Progress
		totalSpeed += download.Speed
		totalSets += download.SetsDownloaded
	}

	averageSpeedDay := 0
	if countDay > 0 {
		averageSpeedDay = totalSpeed / countDay
	}

	averageSpeedMinute := 0
	if countMinute > 0 {
		averageSpeedMinute = totalMinuteBandwidth / countMinute
	}

	daily := DailyDownloadStats{
		Maps:      totalSets,
		Size:      totalSize,
		Speed:     averageSpeedDay,
		Completed: totalFinished,
	}

	return DownloadMetricsV2{
		CurrentDownloads:      current,
		DailyStats:            daily,
		CurrentBandwidthUsage: totalMinuteBandwidth,
		AverageSpeedMinute:    averageSpeedMinute,
	}
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
	minuteSize := 0
	minuteTime := 0

	var minuteConcurrentSpeed float64 = 0
	minuteConcurrentCount := 0

	var totalSpeed float32 = 0

	for _, download := range started {
		id := download.DownloadId
		downloadHasEnded := false
		for _, end := range ended {
			if end.DownloadId == download.DownloadId {
				downloadHasEnded = true
				break
			}
		}

		// if download is older than 24h then not relevant
		if download.CreatedAt.Before(timeYesterday) {
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

		totalConcurrentDownloadSpeed := 0.0
		totalConcurrentCount := 0

		downloadedSize := 0
		downloadedTime := 0
		lastDownloadTime := timeYesterday
		for _, downloaded := range allDownloaded {
			if downloaded.CreatedAt.After(lastDownloadTime) {
				lastDownloadTime = downloaded.CreatedAt
			}

			if downloaded.TotalDownloadSpeed != 0 {
				totalConcurrentDownloadSpeed += downloaded.TotalDownloadSpeed
				totalConcurrentCount++
			}

			downloadedSize += downloaded.Size
			downloadedTime += downloaded.Time
			totalCount++

			if downloaded.CreatedAt.After(timeMinuteAgo) {
				if downloaded.TotalDownloadSpeed != 0 {
					minuteConcurrentSpeed += downloaded.TotalDownloadSpeed
					minuteConcurrentCount++
				} else {
					minuteSize += downloaded.Size
					minuteTime += downloaded.Time
				}
			}
		}

		if lastDownloadTime.Before(timeMinuteAgo) {
			downloadHasEnded = true
		}

		totalSize += downloadedSize
		averageSpeed := calculateBandwidth(downloadedSize, downloadedTime)
		if totalConcurrentCount != 0 {
			averageSpeed = (float32(totalConcurrentDownloadSpeed) * 1e6) / float32(totalConcurrentCount)
		}

		totalSpeed += averageSpeed

		remainingSize := download.Size - downloadedSize

		var estTimeLeft float32
		if averageSpeed == 0 {
			estTimeLeft = -1
		} else {
			// remaining size in bytes, average speed in bps, want seconds
			estTimeLeft = (float32(remainingSize) * 8) / float32(averageSpeed)
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
		Maps: totalCount,
		Size: totalSize,
	}

	currentOldBandwidth := calculateBandwidth(minuteSize, minuteTime)

	currentBandwidth := currentOldBandwidth
	if minuteConcurrentCount != 0 {
		currentBandwidth = (float32(minuteConcurrentSpeed) * 1e6) / float32(minuteConcurrentCount)
	}

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
