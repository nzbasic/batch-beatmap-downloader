package store

import (
	"log"
	"os"

	"github.com/asdine/storm/v3"
	"github.com/joho/godotenv"
)

var db *storm.DB

func init() {
	godotenv.Load()
	db, _ = storm.Open(os.Getenv("METRICS_LOCATION"))
}

func AddMetricData[T MetricsTypes](metric T) {
	err := db.Save(&metric)
	if err != nil {
		log.Println(err.Error())
	}
}

func GetDb() *storm.DB {
	return db
}
