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
	Pk         int `storm:"id,increment"`
	CreatedAt  time.Time
	DownloadId string
	Id         int
	Size       int
	Time       int
}

type MetricsTypes interface {
	DownloadStart | DownloadEnd | BeatmapDownload
}
