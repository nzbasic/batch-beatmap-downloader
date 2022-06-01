package handlers

import (
	"database/sql"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
	"github.com/nzbasic/batch-beatmap-downloader/database"
	"github.com/nzbasic/batch-beatmap-downloader/osu"
)

func BeatmapDownloadHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	beatmap, err := database.GetBeatmapBySetId(vars["setId"])

	if err != nil {
		if err == sql.ErrNoRows {
			w.WriteHeader(http.StatusBadRequest)
		} else {
			w.WriteHeader(http.StatusInternalServerError)
		}
		return
	}

	file, err := ioutil.ReadFile(beatmap.Path)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	filenames := strings.Split(beatmap.Path, "/")
	filename := filenames[len(filenames)-1]

	w.Header().Set("Content-Length", strconv.Itoa(beatmap.Size))
	w.Header().Set("Content-Disposition", "attachment; filename="+filename)
	w.Write(file)
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
