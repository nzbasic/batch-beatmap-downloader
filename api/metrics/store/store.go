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
	open, err := storm.Open(os.Getenv("METRICS_LOCATION"))
	if err != nil {
		panic(err)
	}

	db = open
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
