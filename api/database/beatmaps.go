package database

import (
	"github.com/blockloop/scan"
	"github.com/nzbasic/batch-beatmap-downloader/api/osu"
)

func GetBeatmapById(id string) (osu.BeatmapData, error) {

	var beatmap osu.BeatmapData
	row, err := database.Query("SELECT * FROM beatmaps WHERE id=?", id)

	if err != nil {
		return osu.BeatmapData{}, err
	}

	err = scan.Row(&beatmap, row)
	if err != nil {
		return osu.BeatmapData{}, err
	}
	return beatmap, nil
}
