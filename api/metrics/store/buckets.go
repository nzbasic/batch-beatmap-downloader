package store

import "time"

type DownloadStart struct {
	DownloadId string `storm:"id"`
	CreatedAt  time.Time
	Ids        []int
	Size       int
	Force      bool
}

type DownloadEnd struct {
	DownloadId string `storm:"id"`
}

type BeatmapDownload struct {
	Pk                 int `storm:"id,increment"`
	CreatedAt          time.Time
	DownloadId         string
	Id                 int
	Size               int
	Time               int
	TotalDownloadSpeed float64
}

type MetricsTypes interface {
	DownloadStart | DownloadEnd | BeatmapDownload | DownloadV2
}

type DownloadV2 struct {
	Id             string `storm:"id"`
	ClientId       string
	Size           int
	Progress       int
	Active         bool
	Speed          int
	Started        bool
	LastUpdate     time.Time
	Finished       bool
	SetsDownloaded int
}
