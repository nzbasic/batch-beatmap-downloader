package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/Akumzy/ipc"
)

var ipcIO *ipc.IPC

type DownloadRequest struct {
	Index int    `json:"index"`
	SetId string `json:"setId"`
	Out   string `json:"out"`
}

type DownloadResponse struct {
	Size   int
	Failed bool
}

var connections []http.Client
var direct = "https://direct.nzbasic.com/"

func main() {
	ipcIO = ipc.New()

	go func() {
		ipcIO.On("download", func(payload interface{}) {
			ipcIO.Send("available", nil)

			var request DownloadRequest
			text := payload.(string)
			if err := json.Unmarshal([]byte(text), &request); err != nil {
				log.Println(err)
				return
			}

			for request.Index >= len(connections) {
				connections = append(connections, http.Client{})
			}

			res := download(request.SetId, request.Out, &connections[request.Index])
			ipcIO.Send(request.SetId, res)
		})
	}()

	ipcIO.Start()
}

func download(setId string, path string, client *http.Client) DownloadResponse {
	fileName := setId + ".osz"
	link := direct + fileName

	res, err := client.Get(link)
	if err != nil {
		return DownloadResponse{Failed: true}
	}

	defer res.Body.Close()

	file, err := os.Create(filepath.Join(path, fileName))
	if err != nil {
		return DownloadResponse{Failed: true}
	}

	defer file.Close()

	_, err = io.Copy(file, res.Body)
	if err != nil {
		return DownloadResponse{Failed: true}
	}

	return DownloadResponse{
		Size:   int(res.ContentLength),
		Failed: false,
	}
}
