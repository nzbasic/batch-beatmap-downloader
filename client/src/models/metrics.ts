export interface Metrics {
  Download: DownloadMetrics
  Database: DatabaseMetrics
}

export interface DownloadMetrics {
  CurrentDownloads: CurrentDownload[]
  DailyStats: DailyDownloadStats
  CurrentBandwidthUsage: number
}

export interface CurrentDownload {
  Id: number
  TotalSize: number
  Ended: boolean
  RemainingSize: number
  AverageSpeed: number
  EstTimeLeft: number
}

export interface DailyDownloadStats {
  Maps: number
  Size: number
  Speed: number
}

export interface DatabaseMetrics {
  NumberStoredRanked: number
  NumberStoredUnranked: number
  NumberStoredLoved: number
  LastBeatmapAdded: number
}

export interface DailyDownloadStatsV2 extends DailyDownloadStats {
  Completed: number
}

export interface CurrentDownloadV2 {
  Size: number;
  Progress: number;
  Speed: number;
  Active: boolean;
  Finished: boolean;
}

export interface DownloadMetricsV2 {
  CurrentDownloads: CurrentDownloadV2[];
  DailyStats: DailyDownloadStatsV2;
  CurrentBandwidthUsage: number;
  AverageSpeedMinute: number;
}

export interface MetricsV2 {
  Download: DownloadMetricsV2;
  Database: DatabaseMetrics;
}
