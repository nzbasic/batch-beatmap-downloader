package handlers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
)

func genericJSONDecode[T any](req T, r io.ReadCloser) {
	decoder := json.NewDecoder(r)
	err := decoder.Decode(&req)

	if err != nil {
		log.Println(err)
	}
}

func genericJSONSend[T any](w http.ResponseWriter, req T) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(req)
}
