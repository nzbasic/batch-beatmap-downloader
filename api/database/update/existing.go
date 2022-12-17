package update

import (
	"archive/zip"
	"fmt"
	"io/ioutil"
	"log"
	"strings"
	"time"

	"github.com/blockloop/scan"
	"github.com/nzbasic/batch-beatmap-downloader/api/database"
	"github.com/nzbasic/batch-beatmap-downloader/api/osu"
	"github.com/nzbasic/batch-beatmap-downloader/api/osu/api"
)

var toSkip map[int]bool

func UpdateExistingBeatmapsLoop() {
	toSkip = make(map[int]bool)
	query := fmt.Sprintf("SELECT id, hash FROM beatmaps ORDER BY setId DESC")
	rows, err := database.Query(query)
	if err != nil {
		fmt.Println(err.Error())
	}

	ids := make([]int, 0)
	hashes := make([]string, 0)
	for rows.Next() {
		var id int
		var hash string
		err = rows.Scan(&id, &hash)
		if err != nil {
			fmt.Println(err.Error())
		}

		ids = append(ids, id)
		hashes = append(hashes, hash)
	}

	rows.Close()

	for i := range ids {
		if toSkip[ids[i]] {
			continue
		}

		checkUpdate(ids[i], hashes[i])
	}

	time.Sleep(time.Hour * 24 * 30)
	UpdateExistingBeatmapsLoop()
}

func checkUpdate(id int, hash string) {
	beatmap, err := api.GetBeatmap(id)
	if err != nil {
		fmt.Println(err)
		return
	}

	if hash != beatmap.Checksum {
		data, err := api.DownloadBeatmap(fmt.Sprintf("%d", beatmap.Beatmapset.ID))
		if err != nil {
			log.Println(err)
			return
		}

		body, err := ioutil.ReadAll(&data)
		if err != nil {
			log.Println(err)
			return
		}

		oszData := osu.ParseOszInMemory(body)
		updateFullSet(oszData)
	} else {
		updateApiData(beatmap)
	}
}

func readZipFile(zf *zip.File) ([]byte, error) {
	f, err := zf.Open()
	if err != nil {
		return nil, err
	}
	defer f.Close()
	return ioutil.ReadAll(f)
}

func updateFullSet(oszData []osu.OszBeatmapData) {
	for _, osz := range oszData {
		apiData, err := api.GetBeatmap(osz.BeatmapId)
		if err != nil {
			fmt.Println(err)
			continue
		}

		toSkip[apiData.ID] = true
		updateOszData(osz)
		updateApiData(apiData)
		updateMiscData(osz, apiData)
	}
}

func updateOszData(oszData osu.OszBeatmapData) {
	database.Exec(`UPDATE beatmaps SET size = ?, timingPoints = ?, hitObjects = ? WHERE id = ?`,
		oszData.Size,
		oszData.TimingPoints,
		oszData.HitObjects,
		oszData.BeatmapId,
	)
}

func updateApiData(apiData api.GetBeatmapResponse) {
	// convert time string from
	parsedTime, err := time.Parse(time.RFC3339, apiData.Beatmapset.LastUpdated)
	if err != nil {
		log.Println(err)
	}

	// convert time to unix timestamp
	unixTime := parsedTime.UnixMilli() / 1000

	query := "UPDATE beatmaps SET hp = ?, cs = ?, od = ?, ar = ?, hash = ?, approved = ?, bpm = ?, stars = ?, favouriteCount = ?, hitLength = ?, maxCombo = ?, mode = ?, totalLength = ?, lastUpdate = ?, passCount = ?, playCount = ? WHERE id = ?"
	_, err = database.Exec(query,
		apiData.Drain,
		apiData.CS,
		apiData.Accuracy,
		apiData.AR,
		apiData.Checksum,
		apiData.Beatmapset.Status,
		apiData.BPM,
		apiData.DifficultyRating,
		apiData.Beatmapset.FavouriteCount,
		apiData.HitLength,
		apiData.MaxCombo,
		apiData.Mode,
		apiData.TotalLength,
		unixTime,
		apiData.Passcount,
		apiData.Playcount,
		apiData.ID,
	)

	if err != nil {
		log.Println(err)
	}
}

func updateMiscData(oszData osu.OszBeatmapData, apiData api.GetBeatmapResponse) {
	stream := osu.IsStream(apiData.Mode, apiData.BPM, oszData.HitObjects, oszData.TimingPoints)

	mapper := "0"
	creator := strings.ReplaceAll(apiData.Beatmapset.Creator, "'", "''")
	rows, err := database.Query("SELECT * FROM beatmaps WHERE creator=? AND approved='ranked'", creator)
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

	database.Exec("UPDATE beatmaps SET stream = ?, mapper = ? WHERE id = ?",
		stream,
		mapper,
		apiData.ID,
	)
}
