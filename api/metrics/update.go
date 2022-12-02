package metrics

import (
	"errors"
	"math"
	"time"

	"github.com/google/uuid"
	"github.com/nzbasic/batch-beatmap-downloader/api/database"
	"github.com/nzbasic/batch-beatmap-downloader/api/metrics/store"
)

func getDownload(id string, clientId string) (store.DownloadV2, error) {
	db := store.GetDb()
	var download store.DownloadV2
	err := db.One("Id", id, &download)
	if err != nil {
		return download, err
	}

	if download.ClientId != clientId {
		return download, errors.New("Invalid client id")
	}

	return download, nil
}

func CreateDownload(clientId string, size int) string {
	db := store.GetDb()

	var downloads []store.DownloadV2
	db.Find("ClientId", clientId, &downloads)

	for _, download := range downloads {
		if !download.Started {
			db.DeleteStruct(download)
		}
	}

	id := uuid.New().String()
	start := store.DownloadV2{
		Id:             id,
		ClientId:       clientId,
		Size:           size,
		Active:         false,
		Speed:          0,
		Started:        false,
		LastUpdate:     time.Now(),
		SetsDownloaded: 0,
	}

	db.Save(&start)
	return id
}

func StartDownload(id string, clientId string, size int) {
	download, err := getDownload(id, clientId)
	if err != nil {
		return
	}

	db := store.GetDb()
	download.Active = true
	download.Started = true
	download.Size = int(math.Max(float64(download.Size-size), 0))
	download.LastUpdate = time.Now()
	db.Save(&download)
}

func UpdateDownload(id string, clientId string, kind string) {
	download, err := getDownload(id, clientId)
	if err != nil {
		return
	}

	db := store.GetDb()
	switch kind {
	case "resume":
		download.Active = true
	case "pause":
		download.Active = false
	case "delete":
		download.Finished = true
	}

	download.LastUpdate = time.Now()
	db.Save(&download)
}

func DownloadBeatmap(id string, clientId string, setId string, ms float64) {
	download, err := getDownload(id, clientId)
	if err != nil {
		return
	}

	beatmap, err := database.GetBeatmapBySetId(setId)
	if err != nil {
		return
	}

	speed := float64(beatmap.Size) / (ms / 1000)
	if ms <= 0 {
		speed = 0
	}

	db := store.GetDb()
	download.Progress += beatmap.Size
	download.Speed = int(speed)
	download.LastUpdate = time.Now()
	download.SetsDownloaded++
	db.Save(&download)
}
