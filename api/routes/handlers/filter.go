package handlers

import (
	"net/http"

	"github.com/nzbasic/batch-beatmap-downloader/filter"
)

type FilterResponse struct {
	Ids     []int
	SetIds  []int
	SizeMap map[int]int
	Hashes  []string
}

type FilterRequest struct {
	Node  filter.Node
	Limit *int
}

func removeDuplicateValues(intSlice []int) []int {
	keys := make(map[int]bool)
	list := []int{}

	for _, entry := range intSlice {
		if _, value := keys[entry]; !value {
			keys[entry] = true
			list = append(list, entry)
		}
	}
	return list
}

func FilterHandler(w http.ResponseWriter, r *http.Request) {
	var request FilterRequest
	genericJSONDecode(request, r.Body)

	ids, setIds, size, hashes, err := filter.QueryNode(request.Node, request.Limit)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Header().Set("Content-Type", "application/text")
		w.Write([]byte(err.Error()))
		return
	}

	response := FilterResponse{
		Ids:     ids,
		SetIds:  removeDuplicateValues(setIds),
		SizeMap: size,
		Hashes:  hashes,
	}

	genericJSONSend(w, response)
}
