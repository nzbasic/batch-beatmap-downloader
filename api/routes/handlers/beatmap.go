package handlers

import (
	"database/sql"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
	"github.com/nzbasic/batch-beatmap-downloader/api/database"
	"github.com/nzbasic/batch-beatmap-downloader/api/osu"
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

	w.Header().Set("Content-Disposition", "attachment; filename="+filename)
	w.Write(file)
}

func BeatmapDetailsHandler(w http.ResponseWriter, r *http.Request) {
	var ids []int
	decoder := json.NewDecoder(r.Body)
	decoder.Decode(&ids)

	beatmaps := []osu.BeatmapData{}
	for _, id := range ids {
		beatmap, err := database.GetBeatmapById(id)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		beatmaps = append(beatmaps, beatmap)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(beatmaps)
}
