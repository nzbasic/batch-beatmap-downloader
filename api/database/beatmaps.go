package database

import (
	"github.com/blockloop/scan"
	"github.com/nzbasic/batch-beatmap-downloader/osu"
)

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

func QueryIds(query string, values []string) ([]int, []int, error) {
	ids := []int{}
	setIds := []int{}
	iValues := make([]interface{}, len(values))
	for i, v := range values {
		iValues[i] = v
	}

	rows, err := database.Query(query, iValues...)
	if err != nil {
		return ids, setIds, err
	}

	for rows.Next() {
		var id int
		var setId int
		err := rows.Scan(&id, &setId)
		if err != nil {
			panic(err)
		}
		ids = append(ids, id)
		setIds = append(setIds, setId)
	}

	rows.Close()
	return ids, setIds, nil
}
