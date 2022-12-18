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
	Size           int
}

type OszBeatmapData struct {
	BeatmapId    int
	SetId        int
	Version      string
	TimingPoints string
	HitObjects   string
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

func ParseOszInMemory(data []byte) []OszBeatmapData {
	archive, _ := zip.NewReader(bytes.NewReader(data), int64(len(data)))
	output := []OszBeatmapData{}

	for _, f := range archive.File {
		if strings.HasSuffix(f.Name, ".osu") {
			file, _ := f.Open()
			output = append(output, parseOszBeatmap(file))
		}
	}

	return output
}

func ParseOszInMemoryWithApiData(apiData []osuapi.Beatmap, data []byte) []BeatmapData {
	size := len(data)
	oszData := ParseOszInMemory(data)
	output := []BeatmapData{}

	for _, apiBeatmap := range apiData {
		for _, oszBeatmap := range oszData {
			if apiBeatmap.DiffName == oszBeatmap.Version {
				output = append(output, convertToBeatmapData(apiBeatmap, oszBeatmap, size))
			}
		}
	}

	return output
}

func ParseOszFromFileWithApiData(apiData []osuapi.Beatmap, path string, setId int) []BeatmapData {
	output := []BeatmapData{}
	archive, _ := zip.OpenReader(path)

	size := 0
	for _, f := range archive.File {
		size += int(f.UncompressedSize64)
	}

	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from:\n", r)
		}
	}()
	for _, f := range archive.File {
		if strings.HasSuffix(f.Name, ".osu") {
			file, _ := f.Open()
			oszData := parseOszBeatmap(file)

			for _, apiBeatmap := range apiData {
				if apiBeatmap.DiffName == oszData.Version {
					output = append(output, convertToBeatmapData(apiBeatmap, oszData, size))
				}
			}
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

	return ParseOszFromFileWithApiData(beatmaps, path, setId)
}

func parseOszBeatmap(osu io.ReadCloser) OszBeatmapData {
	// We need the version name, timing points and hit objects from the file, everything else
	// from the api.

	buf := new(bytes.Buffer)
	buf.ReadFrom(osu)
	content := buf.String()

	lines := strings.Split(content, "\n")

	version := ""
	beatmapId := 0
	setId := 0
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

		if strings.HasPrefix(line, "BeatmapID:") {
			beatmapIdDetails := strings.Split(line, "BeatmapID:")
			beatmapId, _ = strconv.Atoi(strings.TrimSpace(beatmapIdDetails[1]))
		}

		if strings.HasPrefix(line, "BeatmapSetID:") {
			setIdDetails := strings.Split(line, "BeatmapSetID:")
			setId, _ = strconv.Atoi(strings.TrimSpace(setIdDetails[1]))
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

	return OszBeatmapData{
		BeatmapId:    beatmapId,
		SetId:        setId,
		Version:      version,
		TimingPoints: strings.Join(timingPoints, CustomDelimiter),
		HitObjects:   strings.Join(hitObjects, CustomDelimiter),
	}
}

func convertToBeatmapData(api osuapi.Beatmap, osz OszBeatmapData, size int) BeatmapData {
	return BeatmapData{
		Title:          api.Title,
		Artist:         api.Artist,
		Creator:        api.Creator,
		Version:        osz.Version,
		Hp:             api.HPDrain,
		Cs:             api.CircleSize,
		Od:             api.OverallDifficulty,
		TimingPoints:   osz.TimingPoints,
		HitObjects:     osz.HitObjects,
		Hash:           api.FileMD5,
		Genre:          api.Genre.String(),
		ApprovedDate:   api.ApprovedDate.GetTime().UnixMilli(),
		Approved:       api.Approved.String(),
		Ar:             api.ApproachRate,
		Bpm:            api.BPM,
		Id:             api.BeatmapID,
		SetId:          api.BeatmapSetID,
		Stars:          api.DifficultyRating,
		FavouriteCount: api.FavouriteCount,
		HitLength:      api.HitLength,
		Language:       api.Language.String(),
		MaxCombo:       api.MaxCombo,
		Mode:           api.Mode.String(),
		TotalLength:    api.TotalLength,
		Tags:           api.Tags,
		Source:         api.Source,
		LastUpdate:     api.LastUpdate.GetTime().Unix(),
		PassCount:      api.Passcount,
		PlayCount:      api.Playcount,
		Size:           size,
	}
}
