package metrics

import "github.com/nzbasic/batch-beatmap-downloader/api/database"

type DatabaseMetrics struct {
	NumberStoredRanked   int
	NumberStoredLoved    int
	NumberStoredUnranked int
	LastBeatmapAdded     int
}

func GetDatabaseMetrics() DatabaseMetrics {
	var time int
	var ranked int
	var unranked int
	var loved int
	database.QueryRow("SELECT approvedDate FROM beatmaps ORDER BY approvedDate DESC LIMIT 1").Scan(&time)
	database.QueryRow("SELECT COUNT(*) FROM beatmaps WHERE Approved = 'ranked'").Scan(&ranked)
	database.QueryRow("SELECT COUNT(*) FROM beatmaps WHERE Approved = 'loved'").Scan(&loved)
	database.QueryRow("SELECT COUNT(*) FROM beatmaps WHERE Approved = 'WIP' OR Approved = 'graveyard' OR Approved = 'pending'").Scan(&unranked)

	return DatabaseMetrics{
		NumberStoredRanked:   ranked,
		NumberStoredLoved:    loved,
		NumberStoredUnranked: unranked,
		LastBeatmapAdded:     time,
	}
}
