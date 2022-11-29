package handlers

import (
	"encoding/json"
	"io"
	"net/http"
)

func genericJSONDecode[T any](req T, r io.ReadCloser) (T, error) {
	decoder := json.NewDecoder(r)
	err := decoder.Decode(&req)
	return req, err
}

func genericJSONSend[T any](w http.ResponseWriter, req T) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(req)
}

func textErrorResponse(w http.ResponseWriter, text string) {
	w.WriteHeader(http.StatusInternalServerError)
	w.Header().Set("Content-Type", "application/text")
	w.Write([]byte(text))
}
