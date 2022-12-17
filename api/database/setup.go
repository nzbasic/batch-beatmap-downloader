package database

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/mattn/go-sqlite3"
	"github.com/nzbasic/batch-beatmap-downloader/api/osu"
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

func AddBeatmap(beatmap osu.BeatmapData) {
	_, err := fullDb.Exec("INSERT INTO beatmaps VALUES(?,?,?,?)",
		beatmap.Id,
		beatmap.SetId,
		beatmap.TimingPoints,
		beatmap.HitObjects,
	)

	isStream := osu.IsStream(beatmap.Mode, beatmap.Bpm, beatmap.HitObjects, beatmap.TimingPoints)
	isRankedMapper := isRankedMapper(beatmap.Creator)
	isFarm := "0"
	archetype := "0"

	cmd := "INSERT INTO beatmaps VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
	_, err = metaDb.Exec(cmd,
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
		beatmap.Size,
		isStream,
		isFarm,
		archetype,
		isRankedMapper,
	)

	if err != nil {
		log.Println(err)
		log.Printf("%+v\n", beatmap)
	}
}
