package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/blockloop/scan"
	"github.com/cheggaaa/pb/v3"
	"github.com/nzbasic/batch-beatmap-downloader/osu"
)

type Updater func(*sql.Tx, osu.BeatmapData)

func BatchUpdate(updater Updater) {
	OpenFullDb()
	count := GetBeatmapCount()

	batchSize := 1000
	pages := count / batchSize
	bar := pb.StartNew(pages)

	for i := 0; i < pages; i++ {
		tx, _ := metaDb.Begin()
		rows, err := fullDb.Query(fmt.Sprintf("SELECT * FROM beatmaps LIMIT 1000 OFFSET %d", (batchSize * i)))
		if err != nil {
			log.Fatal(err)
		}

		var beatmaps []osu.BeatmapData
		err = scan.Rows(&beatmaps, rows)
		if err != nil {
			log.Fatal(err)
		}

		for _, beatmap := range beatmaps {
			updater(tx, beatmap)
		}

		tx.Commit()
		bar.Increment()
	}

	bar.Finish()
}

func updateTxRow(tx *sql.Tx, column string, value string, id int) {
	_, err := tx.Exec(fmt.Sprintf("UPDATE beatmaps SET %s = %s WHERE id=%d", column, value, id))
	if err != nil {
		log.Fatal(err)
	}
}

// methods below were ran once to generate data and are stored here for future reference
func AddFileSize(tx *sql.Tx, row osu.BeatmapData) {
	fi, err := os.Stat(row.Path)
	if err != nil {
		log.Fatal(err)
	}

	updateTxRow(tx, "size", strconv.FormatInt(fi.Size(), 10), row.Id)
}

func AddStream(tx *sql.Tx, row osu.BeatmapData) {
	stream := osu.IsStream(row)
	updateTxRow(tx, "stream", strconv.Itoa(stream), row.Id)
}

func AddFarm(tx *sql.Tx, row osu.BeatmapData) {
	farm := "0"
	for _, setId := range farmSets {
		if strconv.Itoa(row.SetId) == setId {
			farm = "1"
			break
		}
	}

	updateTxRow(tx, "farm", farm, row.Id)
}

func AddRankedMapper(tx *sql.Tx, row osu.BeatmapData) {
	mapper := "0"
	creator := strings.ReplaceAll(row.Creator, "'", "''")
	rows, err := tx.Query(fmt.Sprintf("SELECT * FROM beatmaps WHERE creator='%s' AND approved='ranked'", creator))
	if err != nil {
		log.Fatal(err)
	}

	var beatmaps []osu.BeatmapData
	err = scan.Rows(&beatmaps, rows)
	if err != nil {
		log.Fatal(err)
	}

	if len(beatmaps) > 0 {
		mapper = "1"
	}

	updateTxRow(tx, "rankedMapper", mapper, row.Id)
}
