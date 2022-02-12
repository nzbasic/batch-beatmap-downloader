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

func QueryIds(query string, values []string) ([]int, error) {
	output := []int{}
	iValues := make([]interface{}, len(values))
	for i, v := range values {
		iValues[i] = v
	}

	rows, err := database.Query(query, iValues...)
	if err != nil {
		return output, err
	}

	for rows.Next() {
		var id int
		err := rows.Scan(&id)
		if err != nil {
			panic(err)
		}
		output = append(output, id)
	}

	rows.Close()
	return output, nil
}
