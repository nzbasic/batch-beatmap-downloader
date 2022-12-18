package update

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"time"

	"github.com/nzbasic/batch-beatmap-downloader/api/database"
	"github.com/nzbasic/batch-beatmap-downloader/api/osu"
	"github.com/nzbasic/batch-beatmap-downloader/api/osu/api"
	"github.com/thehowl/go-osuapi"
)

func GetNewBeatmapsLoop() {
	row := database.QueryRow("SELECT setId FROM beatmaps ORDER BY setId DESC LIMIT 1")
	var lastSetId int

	err := row.Scan(&lastSetId)
	if err != nil {
		log.Println(err)
	}

	highestId := getLatestSetId()
	if highestId > 0 && highestId > lastSetId+1 {
		fmt.Printf("Downloading from %d to %d\n", lastSetId+1, highestId)
		for i := lastSetId + 1; i <= highestId; i++ {
			getBeatmap(i)
			time.Sleep(1 * time.Second)
		}
	}

	time.Sleep(5 * time.Minute)
	GetNewBeatmapsLoop()
}

func getBeatmap(setId int) {
	c := osuapi.NewClient(os.Getenv("OSU_KEY"))
	beatmaps, err := c.GetBeatmaps(osuapi.GetBeatmapsOpts{
		BeatmapSetID: setId,
	})

	if err != nil {
		log.Println("osu! API error", err)
		return
	}

	if len(beatmaps) == 0 {
		return
	}

	buffer, err := api.DownloadBeatmap(fmt.Sprintf("%d", setId))
	if err != nil {
		log.Println("Error downloading beatmap", err)
		return
	}

	body, err := ioutil.ReadAll(&buffer)
	if err != nil {
		log.Println("Error reading buffer", err)
		return
	}

	beatmapsData := osu.ParseOszInMemoryWithApiData(beatmaps, body)
	for _, beatmapData := range beatmapsData {
		if beatmapData.Title == "" {
			log.Println(setId, "no title")
			continue
		}

		database.AddBeatmap(beatmapData)
	}
}

func getLatestSetId() int {
	c := osuapi.NewClient(os.Getenv("OSU_KEY"))
	time := time.Now().AddDate(0, 0, -1)
	res, err := c.GetBeatmaps(osuapi.GetBeatmapsOpts{
		Since: &time,
	})

	if err != nil {
		return 0
	}

	highestId := 0
	for _, beatmap := range res {
		if beatmap.BeatmapSetID > highestId {
			highestId = beatmap.BeatmapSetID
		}
	}

	return highestId
}
