package main

import (
	"archive/zip"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/cheggaaa/pb/v3"
	"github.com/joho/godotenv"
	"github.com/nzbasic/batch-beatmap-downloader/api/database"
	"github.com/nzbasic/batch-beatmap-downloader/api/osu"
	"github.com/thehowl/go-osuapi"
)

type Reader struct {
	File    []*zip.File
	Comment string
}

// this is meant to be run once ever
func main() {
	defer database.Close()
	base := "/home/beatmaps"
	paths := []string{}

	// find all .osz files recusively in /home/beatmaps
	err := filepath.Walk(base,
		func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}

			if strings.HasSuffix(path, ".osz") {
				paths = append(paths, path)
			}

			return nil
		})
	if err != nil {
		log.Println(err)
	}

	godotenv.Load()
	c := osuapi.NewClient(os.Getenv("OSU_KEY"))

	bar := pb.StartNew(len(paths))

	for _, path := range paths {
		bar.Increment()
		setId := osu.ParseSetId(path)
		if database.Exists(setId) {
			time.Sleep(50 * time.Millisecond)
			continue
		}

		beatmapsData := osu.ParseOsz(c, path, setId)

		for _, beatmapData := range beatmapsData {
			if beatmapData.Title == "" {
				log.Println(path)
				continue
			}

			//database.AddBeatmap(beatmapData)
		}

		time.Sleep(1*time.Second + 100*time.Millisecond)
	}

	bar.Finish()
}
