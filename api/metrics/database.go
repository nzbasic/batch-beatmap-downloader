package metrics

type DatabaseMetrics struct {
	NumberStoredRanked   int
	NumberStoredLoved    int
	NumberStoredUnranked int
	LastBeatmapAdded     int
}

func GetDatabaseMetrics() DatabaseMetrics {
	// var time int
	// var ranked int
	// var unranked int
	// var loved int
	// database.QueryRow("SELECT approvedDate FROM beatmaps ORDER BY approvedDate DESC LIMIT 1").Scan(&time)
	// database.QueryRow("SELECT COUNT(*) FROM beatmaps WHERE Approved = 'ranked'").Scan(&ranked)
	// database.QueryRow("SELECT COUNT(*) FROM beatmaps WHERE Approved = 'loved'").Scan(&loved)
	// database.QueryRow("SELECT COUNT(*) FROM beatmaps WHERE Approved = 'unranked'").Scan(&unranked)

	return DatabaseMetrics{
		NumberStoredRanked:   115167,
		NumberStoredLoved:    6152,
		NumberStoredUnranked: 0,
		LastBeatmapAdded:     1643626800000,
	}
}
