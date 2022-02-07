package database

import (
	"database/sql"
	"strings"

	_ "github.com/mattn/go-sqlite3"
	"github.com/nzbasic/batch-beatmap-downloader/api/osu"
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

	close()
}

func open() {
	database, _ = sql.Open("sqlite3", "/home/beatmaps/database.db")
	database.SetMaxOpenConns(1)
}

func close() {
	database.Close()
}

func AddBeatmap(beatmap osu.BeatmapData, path string) {

	open()

	cmd := "INSERT INTO beatmaps VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
	_, err := database.Exec(cmd,
		beatmap.Id,
		beatmap.SetId,
		beatmap.Title,
		beatmap.Artist,
		beatmap.Creator,
		beatmap.Version,
		beatmap.HP,
		beatmap.CS,
		beatmap.OD,
		beatmap.AR,
		strings.Join(beatmap.TimingPoints, ">"),
		strings.Join(beatmap.HitObjects, ">"),
		beatmap.Hash,
		beatmap.Genre,
		beatmap.ApprovedDate,
		beatmap.Approved,
		beatmap.BPM,
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
		path,
	)

	if err != nil {
		panic(err)
	}

	close()
}
