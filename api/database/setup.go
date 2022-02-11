package database

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/mattn/go-sqlite3"
	"github.com/nzbasic/batch-beatmap-downloader/osu"
)

var database *sql.DB

func init() {

	open()
	table := "CREATE TABLE IF NOT EXISTS beatmaps (" +
		"id INTEGER PRIMARY KEY, " +
		"setId INTEGER, " +
		"title TEXT, " +
		"artist TEXT, " +
		"creator TEXT, " +
		"version TEXT, " +
		"hp REAL, " +
		"cs REAL, " +
		"od REAL, " +
		"ar REAL, " +
		"timingPoints TEXT, " +
		"hitObjects TEXT, " +
		"hash TEXT, " +
		"genre TEXT, " +
		"approvedDate INTEGER, " +
		"approved TEXT, " +
		"bpm INTEGER, " +
		"stars REAL, " +
		"favouriteCount INTEGER, " +
		"hitLength INTEGER, " +
		"language TEXT, " +
		"maxCombo INTEGER, " +
		"mode TEXT, " +
		"totalLength INTEGER, " +
		"tags TEXT, " +
		"source TEXT, " +
		"lastUpdate INTEGER, " +
		"passCount INTEGER, " +
		"playCount INTEGER," +
		"path TEXT" +
		")"

	_, err := database.Exec(table)
	if err != nil {
		panic(err)
	}
}

func Exists(setId int) bool {

	cmd := "SELECT id FROM beatmaps WHERE setId = " + fmt.Sprint(setId)
	row := database.QueryRow(cmd)
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

	cmd := "INSERT INTO beatmaps VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
	_, err := database.Exec(cmd,
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
	)

	if err != nil {
		log.Println(err)
		log.Printf("%+v\n", beatmap)
	}
}
