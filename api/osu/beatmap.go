package osu

import (
	"archive/zip"
	"bytes"
	"fmt"
	"io"
	"log"
	"math"
	"regexp"
	"strconv"
	"strings"

	"github.com/thehowl/go-osuapi"
)

var CustomDelimiter = ">"

type BeatmapData struct {
	Title          string  `filterType:"Text"`
	Artist         string  `filterType:"Text"`
	Creator        string  `filterType:"Text"`
	Version        string  `filterType:"Text"`
	Hp             float64 `filterType:"Numeric"`
	Cs             float64 `filterType:"Numeric"`
	Od             float64 `filterType:"Numeric"`
	Ar             float64 `filterType:"Numeric"`
	TimingPoints   string  `filterType:"None"`
	HitObjects     string  `filterType:"None"`
	Hash           string  `filterType:"Text"`
	Genre          string  `filterType:"Text"`
	ApprovedDate   int64   `filterType:"Numeric"`
	Approved       string  `filterType:"Text"`
	Bpm            float64 `filterType:"Numeric"`
	Id             int     `filterType:"Numeric"`
	SetId          int     `filterType:"Numeric"`
	Stars          float64 `filterType:"Numeric"`
	FavouriteCount int     `filterType:"Numeric"`
	HitLength      int     `filterType:"Numeric"`
	Language       string  `filterType:"Text"`
	MaxCombo       int     `filterType:"Numeric"`
	Mode           string  `filterType:"Text"`
	TotalLength    int     `filterType:"Numeric"`
	Tags           string  `filterType:"Text"`
	Source         string  `filterType:"Text"`
	LastUpdate     int64   `filterType:"Numeric"`
	PassCount      int     `filterType:"Numeric"`
	PlayCount      int     `filterType:"Numeric"`
	Path           string  `filterType:"None"`
	Size           int
}

var r *regexp.Regexp

func init() {
	r, _ = regexp.Compile(`^\d+`)
}

func IsStream(row BeatmapData) int {
	if row.Mode != "osu!" {
		return 0
	}

	burstCount := 5
	minimumPercentage := 20
	var minimumBpm float64 = 140
	maximumTimeDifference := math.Ceil((1 / (minimumBpm * 4 / 60)) * 1000)

	if row.Bpm <= minimumBpm {
		return 0
	}

	type HitObject struct {
		Type int
		X    int
		Y    int
		Time int
	}

	type TimingPoint struct {
		BPM  float64
		Time int
	}

	hitObjectsRaw := strings.Split(row.HitObjects, ">")
	timingPointsRaw := strings.Split(row.TimingPoints, ">")
	hitObjects := []HitObject{}
	timingPoints := []TimingPoint{}

	for _, hit := range hitObjectsRaw {
		values := strings.Split(hit, ",")
		if len(values) >= 4 {
			x, _ := strconv.Atoi(values[0])
			y, _ := strconv.Atoi(values[1])
			time, _ := strconv.Atoi(values[2])
			typeD, _ := strconv.Atoi(values[3])

			hitObject := HitObject{
				X:    x,
				Y:    y,
				Type: typeD,
				Time: time,
			}

			hitObjects = append(hitObjects, hitObject)
		}
	}

	for _, time := range timingPointsRaw {
		values := strings.Split(strings.TrimSpace(time), ",")
		//fmt.Printf("%+v\n", values)
		if len(values) >= 2 {
			t, _ := strconv.Atoi(values[0])
			length, _ := strconv.ParseFloat(values[1], 0)
			if length > 0 {
				bpm := math.Round(60000 / length)
				timingPoint := TimingPoint{
					BPM:  bpm,
					Time: t,
				}

				timingPoints = append(timingPoints, timingPoint)
			}
		}
	}

	if len(timingPoints) == 0 {
		return 0
	}

	currentBurstCount := 0
	maxBurstCount := 1
	totalBurstNotes := 0
	var lastNoteTime int
	for _, obj := range hitObjects {
		if obj.Type&1 == 1 {
			if currentBurstCount == 0 {
				lastNoteTime = obj.Time
				currentBurstCount = 1
			} else {
				if len(timingPoints) >= 2 {
					if obj.Time > timingPoints[0].Time && obj.Time > timingPoints[1].Time {
						timingPoints = timingPoints[1:]
					}
				}

				bpm := timingPoints[0].BPM
				calculatedTimeDifference := math.Ceil((1/(bpm*4/60))*1000) * 1.1
				timeDifference := obj.Time - lastNoteTime
				if (timeDifference <= int(calculatedTimeDifference)) && (timeDifference < int(maximumTimeDifference)) {
					currentBurstCount++
					if currentBurstCount > maxBurstCount {
						maxBurstCount = currentBurstCount
					}
					if currentBurstCount == burstCount {
						totalBurstNotes += burstCount
					} else if currentBurstCount > burstCount {
						totalBurstNotes++
					}
				} else {
					currentBurstCount = 0
				}
				lastNoteTime = obj.Time
			}
		} else {
			currentBurstCount = 0
			lastNoteTime = obj.Time
		}
	}

	if (float64(totalBurstNotes)/float64(len(hitObjects)))*100 >= float64(minimumPercentage) {
		return 1
	} else {
		//println(totalBurstNotes, minimumPercentage)
		return 0
	}
}

func ParseSetId(path string) int {
	// get the number at the start of the file name in an int
	filenames := strings.Split(path, "/")
	filename := filenames[len(filenames)-1]
	number := r.FindString(filename)
	setId, _ := strconv.Atoi(number)
	return setId
}

func ParseOszWithBeatmap(beatmaps []osuapi.Beatmap, path string, setId int) []BeatmapData {
	output := []BeatmapData{}
	archive, _ := zip.OpenReader(path)

	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from:\n", r)
		}
	}()
	for _, f := range archive.File {
		if strings.HasSuffix(f.Name, ".osu") {
			file, _ := f.Open()
			output = append(output, parseBeatmap(beatmaps, file, setId, path))
		}
	}

	archive.Close()
	return output
}

func ParseOsz(c *osuapi.Client, path string, setId int) []BeatmapData {
	beatmaps, err := c.GetBeatmaps(osuapi.GetBeatmapsOpts{
		BeatmapSetID: setId,
	})

	if err != nil {
		log.Println(setId)
		log.Println(err.Error())
	}

	return ParseOszWithBeatmap(beatmaps, path, setId)
}

func parseBeatmap(beatmaps []osuapi.Beatmap, osu io.ReadCloser, setId int, path string) BeatmapData {
	// We need the version name, timing points and hit objects from the file, everything else
	// from the api.

	buf := new(bytes.Buffer)
	buf.ReadFrom(osu)
	content := buf.String()

	lines := strings.Split(content, "\n")

	version := ""
	timingPoints := []string{}
	hitObjects := []string{}
	timingFlag := false
	hitFlag := false

	for _, line := range lines {
		if strings.HasPrefix(line, "Version:") {
			versionDetails := strings.Split(line, "Version:")
			if len(versionDetails) != 2 {
				log.Println(line)
			}
			version = strings.TrimSpace(versionDetails[1])
			if len(version) == 0 {
				version = "Normal"
			}
		}

		if timingFlag {
			if len(line) <= 1 {
				timingFlag = false
				continue
			}
			timingPoints = append(timingPoints, line+" ")
		}

		if hitFlag {
			if len(line) <= 1 {
				hitFlag = false
				continue
			}
			hitObjects = append(hitObjects, line+" ")
		}

		// will always come after the version text
		if strings.HasPrefix(line, "[HitObjects]") {
			hitFlag = true
		}

		if strings.HasPrefix(line, "[TimingPoints]") {
			timingFlag = true
		}
	}

	// find the matching map from api using difficulty name

	for _, apiBeatmap := range beatmaps {
		if apiBeatmap.DiffName == version {
			return BeatmapData{
				Title:          apiBeatmap.Title,
				Artist:         apiBeatmap.Artist,
				Creator:        apiBeatmap.Creator,
				Version:        version,
				Hp:             apiBeatmap.HPDrain,
				Cs:             apiBeatmap.CircleSize,
				Od:             apiBeatmap.OverallDifficulty,
				TimingPoints:   strings.Join(timingPoints, CustomDelimiter),
				HitObjects:     strings.Join(hitObjects, CustomDelimiter),
				Hash:           apiBeatmap.FileMD5,
				Genre:          apiBeatmap.Genre.String(),
				ApprovedDate:   apiBeatmap.ApprovedDate.GetTime().UnixMilli(),
				Approved:       apiBeatmap.Approved.String(),
				Ar:             apiBeatmap.ApproachRate,
				Bpm:            apiBeatmap.BPM,
				Id:             apiBeatmap.BeatmapID,
				SetId:          apiBeatmap.BeatmapSetID,
				Stars:          apiBeatmap.DifficultyRating,
				FavouriteCount: apiBeatmap.FavouriteCount,
				HitLength:      apiBeatmap.HitLength,
				Language:       apiBeatmap.Language.String(),
				MaxCombo:       apiBeatmap.MaxCombo,
				Mode:           apiBeatmap.Mode.String(),
				TotalLength:    apiBeatmap.TotalLength,
				Tags:           apiBeatmap.Tags,
				Source:         apiBeatmap.Source,
				LastUpdate:     apiBeatmap.LastUpdate.GetTime().Unix(),
				PassCount:      apiBeatmap.Passcount,
				PlayCount:      apiBeatmap.Playcount,
				Path:           path,
			}
		}
	}

	log.Println(setId)
	return BeatmapData{}
}
