package database

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/mattn/go-sqlite3"
	"github.com/nzbasic/batch-beatmap-downloader/osu"
)

func init() {
	open()
}

func Exists(setId int) bool {
	cmd := "SELECT id FROM beatmaps WHERE setId = " + fmt.Sprint(setId)
	row := metaDb.QueryRow(cmd)
	id := 0
	err := row.Scan(&id)

	if err != nil {
		if err == sql.ErrNoRows {
			return false
		}
		log.Println(err)
	}

	return true
}

func AddBeatmap(beatmap osu.BeatmapData, size int64) {
	cmd := "INSERT INTO beatmaps VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
	_, err := fullDb.Exec(cmd,
		beatmap.Id,
		beatmap.SetId,
		beatmap.Title,
		beatmap.Artist,
		beatmap.Creator,
		beatmap.Version,
		beatmap.Hp,
		beatmap.Cs,
		beatmap.Od,
		beatmap.Ar,
		beatmap.TimingPoints,
		beatmap.HitObjects,
		beatmap.Hash,
		beatmap.Genre,
		beatmap.ApprovedDate,
		beatmap.Approved,
		beatmap.Bpm,
		beatmap.Stars,
		beatmap.FavouriteCount,
		beatmap.HitLength,
		beatmap.Language,
		beatmap.MaxCombo,
		beatmap.Mode,
		beatmap.TotalLength,
		beatmap.Tags,
		beatmap.Source,
		beatmap.LastUpdate,
		beatmap.PassCount,
		beatmap.PlayCount,
		beatmap.Path,
		size,
		"0",
		"0",
		"",
	)

	if err != nil {
		log.Println(err)
		log.Printf("%+v\n", beatmap)
	}
}
