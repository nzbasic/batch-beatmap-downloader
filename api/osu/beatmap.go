package osu

import (
	"archive/zip"
	"bytes"
	"io"
	"log"
	"regexp"
	"strconv"
	"strings"

	"github.com/thehowl/go-osuapi"
)

type BeatmapData struct {
	Title          string
	Artist         string
	Creator        string
	Version        string
	HP             float64
	CS             float64
	OD             float64
	AR             float64
	TimingPoints   []string
	HitObjects     []string
	Hash           string
	Genre          string
	ApprovedDate   int64
	Approved       string
	BPM            float64
	Id             int
	SetId          int
	Stars          float64
	FavouriteCount int
	HitLength      int
	Language       string
	MaxCombo       int
	Mode           string
	TotalLength    int
	Tags           string
	Source         string
	LastUpdate     int64
	PassCount      int
	PlayCount      int
}

var r *regexp.Regexp

func init() {
	r, _ = regexp.Compile(`^\d+`)
}

func ParseOsz(c *osuapi.Client, path string) []BeatmapData {

	output := []BeatmapData{}

	// get the number at the start of the file name in an int
	filenames := strings.Split(path, "/")
	filename := filenames[len(filenames)-1]
	number := r.FindString(filename)
	setId, _ := strconv.Atoi(number)

	beatmaps, err := c.GetBeatmaps(osuapi.GetBeatmapsOpts{
		BeatmapSetID: setId,
	})

	if err != nil {
		log.Println(setId)
		log.Println(err.Error())
	}

	archive, _ := zip.OpenReader(path)
	defer archive.Close()

	for _, f := range archive.File {
		if strings.HasSuffix(f.Name, ".osu") {
			file, _ := f.Open()
			output = append(output, parseBeatmap(beatmaps, file, setId))
		}
	}

	return output
}

func parseBeatmap(beatmaps []osuapi.Beatmap, osu io.ReadCloser, setId int) BeatmapData {
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
				HP:             apiBeatmap.HPDrain,
				CS:             apiBeatmap.CircleSize,
				OD:             apiBeatmap.OverallDifficulty,
				TimingPoints:   timingPoints,
				HitObjects:     hitObjects,
				Hash:           apiBeatmap.FileMD5,
				Genre:          apiBeatmap.Genre.String(),
				ApprovedDate:   apiBeatmap.ApprovedDate.GetTime().UnixMilli(),
				Approved:       apiBeatmap.Approved.String(),
				AR:             apiBeatmap.ApproachRate,
				BPM:            apiBeatmap.BPM,
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
			}
		}
	}

	log.Println(setId)
	return BeatmapData{}
}
