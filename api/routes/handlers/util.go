package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

func genericJSONDecode[T any](req T, r io.ReadCloser) (T, error) {
	decoder := json.NewDecoder(r)
	err := decoder.Decode(&req)
	return req, err
}

func genericJSONSend[T any](w http.ResponseWriter, req T) {
	w.Header().Set("Content-Type", "application/json")
	bytes, err := json.Marshal(req)
	if err != nil {
		log.Println(err)
	}

	w.Header().Set("Content-Length", fmt.Sprintf("%d", len(bytes)))
	_, err = w.Write(bytes)
}

func textErrorResponse(w http.ResponseWriter, text string) {
	w.WriteHeader(http.StatusInternalServerError)
	w.Header().Set("Content-Type", "application/text")
	w.Write([]byte(text))
}
