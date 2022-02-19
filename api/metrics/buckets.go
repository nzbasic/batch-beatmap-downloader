package metrics

type DownloadStart struct {
	DownloadId string `storm:"id"`
	Ids        []int
	Size       int
	Force      bool
}

type DownloadEnd struct {
	DownloadId string `storm:"id"`
}

type BeatmapDownload struct {
	DownloadId string `storm:"id"`
	Id         int
	Size       int
	Time       int
}

type MetricsTypes interface {
	DownloadStart | DownloadEnd | BeatmapDownload
}
