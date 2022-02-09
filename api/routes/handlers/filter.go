package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/nzbasic/batch-beatmap-downloader/api/filter"
)

func FilterHandler(w http.ResponseWriter, r *http.Request) {

	var filters []filter.Filter
	decoder := json.NewDecoder(r.Body)
	decoder.Decode(&filters)

	ids, err := filter.ParseFilters(filters)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Header().Set("Content-Type", "application/text")
		w.Write([]byte(err.Error()))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ids)
}
