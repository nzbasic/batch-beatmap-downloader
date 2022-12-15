package api

import "fmt"

var base = "beatmaps"

func GetBeatmap(id int) (GetBeatmapResponse, error) {
	body := make(map[string]interface{})
	body["fromCache"] = false
	url := fmt.Sprintf("%s/%d", base, id)

	var res GetBeatmapResponse
	return request(url, body, res)
}

func GetBeatmapCache(id int) (GetBeatmapResponse, error) {
	body := make(map[string]interface{})
	body["fromCache"] = true
	url := fmt.Sprintf("%s/%d", base, id)

	var res GetBeatmapResponse
	return request(url, body, res)
}

type GetBeatmapResponse struct {
	BeatmapsetID     int     `json:"beatmapset_id"`
	DifficultyRating float64 `json:"difficulty_rating"`
	ID               int     `json:"id"`
	Mode             string  `json:"mode"`
	Status           string  `json:"status"`
	TotalLength      int     `json:"total_length"`
	UserID           int     `json:"user_id"`
	Version          string  `json:"version"`
	Accuracy         float64 `json:"accuracy"`
	AR               float64 `json:"ar"`
	BPM              float64 `json:"bpm"`
	Convert          bool    `json:"convert"`
	CountCircles     int     `json:"count_circles"`
	CountSliders     int     `json:"count_sliders"`
	CountSpinners    int     `json:"count_spinners"`
	CS               float64 `json:"cs"`
	DeletedAt        string  `json:"deleted_at"`
	Drain            float64 `json:"drain"`
	HitLength        int     `json:"hit_length"`
	IsScoreable      bool    `json:"is_scoreable"`
	LastUpdated      string  `json:"last_updated"`
	ModeInt          int     `json:"mode_int"`
	Passcount        int     `json:"passcount"`
	Playcount        int     `json:"playcount"`
	Ranked           int     `json:"ranked"`
	URL              string  `json:"url"`
	Checksum         string  `json:"checksum"`
	Beatmapset       struct {
		Artist        string `json:"artist"`
		ArtistUnicode string `json:"artist_unicode"`
		Covers        struct {
			Cover       string `json:"cover"`
			Cover2x     string `json:"cover@2x"`
			Card        string `json:"card"`
			Card2x      string `json:"card@2x"`
			List        string `json:"list"`
			List2x      string `json:"list@2x"`
			Slimcover   string `json:"slimcover"`
			Slimcover2x string `json:"slimcover@2x"`
		} `json:"covers"`
		Creator        string `json:"creator"`
		FavouriteCount int    `json:"favourite_count"`
		HasFavourited  bool   `json:"has_favourited"`
		Hype           struct {
			Current  int `json:"current"`
			Required int `json:"required"`
		} `json:"hype"`
		ID           int    `json:"id"`
		NSFW         bool   `json:"nsfw"`
		Offset       int    `json:"offset"`
		PlayCount    int    `json:"play_count"`
		PreviewURL   string `json:"preview_url"`
		Source       string `json:"source"`
		Spotlight    bool   `json:"spotlight"`
		Status       string `json:"status"`
		Title        string `json:"title"`
		TitleUnicode string `json:"title_unicode"`
		TrackID      int    `json:"track_id"`
		UserID       int    `json:"user_id"`
		Video        bool   `json:"video"`
		Availability struct {
			DownloadDisabled bool   `json:"download_disabled"`
			MoreInformation  string `json:"more_information"`
		} `json:"availability"`
		BPM                float64 `json:"bpm"`
		CanBeHyped         bool    `json:"can_be_hyped"`
		DiscussionEnabled  bool    `json:"discussion_enabled"`
		IsScoreable        bool    `json:"is_scoreable"`
		LastUpdated        string  `json:"last_updated"`
		NominationsSummary struct {
			Current  int `json:"current"`
			Required int `json:"required"`
		} `json:"nominations_summary"`
		Storyboard    bool   `json:"storyboard"`
		SubmittedDate string `json:"submitted_date"`
		Subscribed    bool   `json:"subscribed"`
		Tags          string `json:"tags"`
	} `json:"beatmapset"`
	FailTimes struct {
		Fail []int `json:"fail"`
		Exit []int `json:"exit"`
	} `json:"failtimes"`
	MaxCombo int `json:"max_combo"`
}
