package metrics

import (
	"os"

	"github.com/asdine/storm/v3"
	"github.com/joho/godotenv"
)

var db *storm.DB

func init() {
	godotenv.Load()
	db, err := storm.Open(os.Getenv("METRICS_LOCATION"))
	if err != nil {
		panic(err)
	}

	AddMetricData(DownloadStart{})

	defer db.Close()
}

func AddMetricData[T MetricsTypes](metric T) {
	err := db.Save(&metric)
	if err != nil {
		panic(err)
	}
}
