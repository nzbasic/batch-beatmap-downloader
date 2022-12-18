package handlers

import (
	"database/sql"
	"net/http"
	"os"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/nzbasic/batch-beatmap-downloader/api/database"
	"github.com/nzbasic/batch-beatmap-downloader/api/osu"
)

var cdnUrl string

func init() {
	godotenv.Load()
	cdnUrl = os.Getenv("CDN_URL")
}

func BeatmapDownloadHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	_, err := database.GetBeatmapBySetId(vars["setId"])

	if err != nil {
		if err == sql.ErrNoRows {
			w.WriteHeader(http.StatusBadRequest)
		} else {
			w.WriteHeader(http.StatusInternalServerError)
		}
		return
	}

	resource := cdnUrl + "/" + vars["setId"] + ".osz"
	http.Redirect(w, r, resource, http.StatusFound)
	return
}

func BeatmapDetailsHandler(w http.ResponseWriter, r *http.Request) {
	var ids []int
	ids, _ = genericJSONDecode(ids, r.Body)

	beatmaps := []osu.BeatmapData{}
	for _, id := range ids {
		beatmap, err := database.GetBeatmapById(id)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		beatmaps = append(beatmaps, beatmap)
	}

	genericJSONSend(w, beatmaps)
}

func BeatmapHashMap(w http.ResponseWriter, r *http.Request) {
	hashMap, err := database.GetBeatmapHashMap()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	genericJSONSend(w, hashMap)
}

func BeatmapHashMapV2(w http.ResponseWriter, r *http.Request) {
	hashMap, err := database.GetBeatmapHashMapV2()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	genericJSONSend(w, hashMap)
}

func CalculateSizeOfBeatmaps(w http.ResponseWriter, r *http.Request) {
	var ids []int
	ids, _ = genericJSONDecode(ids, r.Body)

	totalSize := 0
	for _, id := range ids {
		beatmapDetails, err := database.GetBeatmapBySetId(strconv.Itoa(id))

		if err != nil {
			continue
		}

		totalSize += beatmapDetails.Size
	}

	genericJSONSend(w, totalSize)
}
