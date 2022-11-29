package metrics

type CurrentDownload struct {
	Id            string
	TotalSize     int
	Ended         bool
	RemainingSize int
	AverageSpeed  float32
	EstTimeLeft   float32
}

type DailyDownloadStats struct {
	Maps      int
	Size      int
	Speed     int
	Completed int
}

type DownloadMetrics struct {
	CurrentDownloads      []CurrentDownload
	DailyStats            DailyDownloadStats
	CurrentBandwidthUsage float32
}

type CurrentDownloadV2 struct {
	Size     int
	Progress int
	Speed    int
	Active   bool
	Finished bool
}

type DownloadMetricsV2 struct {
	CurrentDownloads      []CurrentDownloadV2
	DailyStats            DailyDownloadStats
	CurrentBandwidthUsage int
	AverageSpeedMinute    int
}
