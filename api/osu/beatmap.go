package osu

import (
	"archive/zip"
	"bytes"
	"fmt"
	"io"
	"log"
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
	Stream         int     `filterType:"Numeric"`
}

var r *regexp.Regexp

func init() {
	r, _ = regexp.Compile(`^\d+`)
}

func ParseSetId(path string) int {
	// get the number at the start of the file name in an int
	filenames := strings.Split(path, "/")
	filename := filenames[len(filenames)-1]
	number := r.FindString(filename)
	setId, _ := strconv.Atoi(number)
	return setId
}

func ParseOsz(c *osuapi.Client, path string, setId int) []BeatmapData {

	output := []BeatmapData{}

	beatmaps, err := c.GetBeatmaps(osuapi.GetBeatmapsOpts{
		BeatmapSetID: setId,
	})

	if err != nil {
		log.Println(setId)
		log.Println(err.Error())
	}

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
