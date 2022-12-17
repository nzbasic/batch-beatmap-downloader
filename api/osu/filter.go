package osu

import (
	"math"
	"strconv"
	"strings"
)

func IsStream(mode string, bpm float64, hits string, timings string) int {
	if mode != "osu!" {
		return 0
	}

	burstCount := 5
	minimumPercentage := 20
	var minimumBpm float64 = 140
	maximumTimeDifference := math.Ceil((1 / (minimumBpm * 4 / 60)) * 1000)

	if bpm <= minimumBpm {
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

	hitObjectsRaw := strings.Split(hits, ">")
	timingPointsRaw := strings.Split(timings, ">")
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
