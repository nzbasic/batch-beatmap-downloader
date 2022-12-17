package api

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

func DownloadBeatmap(setId string) (bytes.Buffer, error) {
	base := os.Getenv("DOWNLOAD_BASE_URL")

	uploadClient := &http.Client{}
	downloadClient := &http.Client{
		Transport: &http.Transport{
			ResponseHeaderTimeout: 5 * time.Second,
		},
	}

	setIdString := fmt.Sprint(setId)
	uploadFilename := setIdString + ".osz"

	res, err := downloadClient.Get(base + setIdString)
	if err != nil {
		return bytes.Buffer{}, err
	}

	time.Sleep(500)

	if res.ContentLength == 36 {
		res.Body.Close()
		return bytes.Buffer{}, errors.New(setIdString + " doesn't exist")
	}

	if res.StatusCode != http.StatusOK {
		res.Body.Close()
		return bytes.Buffer{}, errors.New("status code is not 200")
	}

	var buf bytes.Buffer
	tee := io.TeeReader(res.Body, &buf)

	a, err := http.NewRequest(http.MethodPut, fmt.Sprintf("https://bbd-api.nzbasic.workers.dev/%s", uploadFilename), tee)
	if err != nil {
		res.Body.Close()
		return bytes.Buffer{}, err
	}

	a.Header.Set("Content-Type", "application/octet-stream")
	a.Header.Set("X-Custom-Auth-Key", os.Getenv("CDN_KEY"))

	res, err = uploadClient.Do(a)
	if err != nil {
		return bytes.Buffer{}, err
	}

	return buf, nil
}
