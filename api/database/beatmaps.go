package database

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/blockloop/scan"
	"github.com/nzbasic/batch-beatmap-downloader/logs"
	"github.com/nzbasic/batch-beatmap-downloader/osu"
)

func Query(query string) (*sql.Rows, error) {
	return database.Query(query)
}

func QueryRow(query string) *sql.Row {
	return database.QueryRow(query)
}

var farmSets []string

func refreshFarm() {
	uri := "https://osutracker.com/api/stats/farmSets"
	resp, err := http.Get(uri)
	if err != nil {
		log.Fatalln(err)
	}

	decoder := json.NewDecoder(resp.Body)
	err = decoder.Decode(&farmSets)
	if err != nil {
		log.Fatalln(err)
	}

	BatchUpdate(AddFarm)
}

func GetBeatmapCount() int {
	var count int
	database.QueryRow("SELECT COUNT(*) FROM beatmaps").Scan(&count)
	return count
}

func GetRowAtOffset(offset int) osu.BeatmapData {
	var details osu.BeatmapData
	query := "SELECT * FROM beatmaps LIMIT 1 OFFSET " + strconv.Itoa(offset)
	row, _ := database.Query(query)
	scan.Row(&details, row)
	return details
}

func UpdateRow(id int, column string, value string) {
	query := fmt.Sprintf("UPDATE beatmaps SET %s = %s WHERE id=%d", column, value, id)
	_, err := database.Exec(query)
	if err != nil {
		println(err.Error())
	}
}

func GetBeatmapBySetId(setId string) (osu.BeatmapData, error) {
	var beatmap osu.BeatmapData
	row, err := database.Query("SELECT * FROM beatmaps WHERE setId=?", setId)

	if err != nil {
		return osu.BeatmapData{}, err
	}

	err = scan.Row(&beatmap, row)
	if err != nil {
		return osu.BeatmapData{}, err
	}
	return beatmap, nil
}

func GetBeatmapById(id int) (osu.BeatmapData, error) {
	var beatmap osu.BeatmapData
	row, err := database.Query("SELECT * FROM beatmaps WHERE id=?", id)

	if err != nil {
		return osu.BeatmapData{}, err
	}

	err = scan.Row(&beatmap, row)
	if err != nil {
		return osu.BeatmapData{}, err
	}

	beatmap.HitObjects = ""
	beatmap.TimingPoints = ""
	beatmap.Path = ""
	return beatmap, nil
}

type QueryLog struct {
	Query    string
	Duration string
	Size     int
	Values   []string
}

func QueryIds(query string, values []string) ([]int, []int, map[int]int, []string, error) {
	ids := []int{}
	setIds := []int{}
	sizeMap := make(map[int]int)
	hashes := []string{}
	iValues := make([]interface{}, len(values))
	for i, v := range values {
		iValues[i] = v
	}

	before := time.Now()
	rows, err := database.Query(query, iValues...)
	if err != nil {
		return ids, setIds, sizeMap, hashes, err
	}

	for rows.Next() {
		var id int
		var setId int
		var size int
		var hash string
		rows.Scan(&id, &setId, &size, &hash)
		ids = append(ids, id)
		setIds = append(setIds, setId)
		sizeMap[setId] = size
		hashes = append(hashes, hash)
	}

	after := time.Now()
	difference := after.Sub(before)

	totalSize := 0
	for _, size := range sizeMap {
		totalSize += size
	}

	queryLog := QueryLog{
		Duration: difference.String(),
		Query:    query,
		Size:     totalSize,
		Values:   values,
	}

	bytes, _ := json.Marshal(queryLog)
	logs.Log("query", string(bytes))
	rows.Close()
	return ids, setIds, sizeMap, hashes, nil
}

func GetBeatmapHashMap() (map[string]int, error) {
	rows, err := database.Query("SELECT setId, hash FROM beatmaps")

	if err != nil {
		return nil, err
	}

	hashMap := make(map[string]int)
	for rows.Next() {
		var setId int
		var hash string
		rows.Scan(&setId, &hash)
		hashMap[hash] = setId
	}

	return hashMap, nil
}
