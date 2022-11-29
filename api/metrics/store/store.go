package store

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/asdine/storm/v3"
	"github.com/go-co-op/gocron"
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

	s := gocron.NewScheduler(time.UTC)
	s.Every(1).Week().At("00:00").Do(func() {
		log.Println("Clearing metrics")
		db.Drop("BeatmapDownload")
		db.Drop("DownloadEnd")
		db.Drop("DownloadStart")
	})

	s.StartAsync()
}

func AddMetricData[T MetricsTypes](metric T) {
	err := db.Save(&metric)
	if err != nil {
		fmt.Printf("%v", metric)
		log.Println(err.Error())
	}
}

func GetDb() *storm.DB {
	return db
}
