package handlers

import (
	"net/http"

	"github.com/nzbasic/batch-beatmap-downloader/filter"
	"github.com/nzbasic/batch-beatmap-downloader/metrics"
)

type FilterResponse struct {
	Ids     []int
	SetIds  []int
	SizeMap map[int]int
	Hashes  []string
}

type FilterResponseV2 struct {
	Ids     []int
	SetIds  []int
	SizeMap map[int]int
	Hashes  []string
	Id      string
}

type FilterRequest struct {
	Node      filter.Node
	Limit     *int
	By        *string
	Direction *string
}

type FilterRequestV2 struct {
	Node      filter.Node
	Limit     *int
	By        *string
	Direction *string
	ClientId  string
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
	var err error
	request, err = genericJSONDecode(request, r.Body)
	if err != nil {
		textErrorResponse(w, "Invalid filter request, please make sure client is up to date")
	}

	ids, setIds, size, hashes, err := filter.QueryNode(request.Node, request.Limit, request.By, request.Direction)
	if err != nil {
		textErrorResponse(w, err.Error())
	}

	response := FilterResponse{
		Ids:     ids,
		SetIds:  removeDuplicateValues(setIds),
		SizeMap: size,
		Hashes:  hashes,
	}

	genericJSONSend(w, response)
}

func FilterHandlerV2(w http.ResponseWriter, r *http.Request) {
	var request FilterRequestV2
	var err error
	request, err = genericJSONDecode(request, r.Body)
	if err != nil {
		textErrorResponse(w, "Invalid filter request, please make sure client is up to date")
	}

	ids, setIds, size, hashes, err := filter.QueryNode(request.Node, request.Limit, request.By, request.Direction)
	if err != nil {
		textErrorResponse(w, err.Error())
	}

	response := FilterResponseV2{
		Ids:     ids,
		SetIds:  removeDuplicateValues(setIds),
		SizeMap: size,
		Hashes:  hashes,
	}

	totalSize := 0
	for _, size := range size {
		totalSize += size
	}

	id := metrics.CreateDownload(request.ClientId, totalSize)
	response.Id = id
	genericJSONSend(w, response)
}
