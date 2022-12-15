package filter

import (
	"errors"
	"strings"
)

var validColumnNames = []string{
	"id", "setId", "title", "artist", "creator", "version", "hp",
	"cs", "od", "ar", "hash", "genre", "approvedDate", "approved",
	"bpm", "favouriteCount", "hitLength", "language", "maxCombo",
	"mode", "totalLength", "tags", "source", "lastUpdate", "stars",
	"passCount", "playCount", "size", "stream", "farm", "rankedMapper",
	"archetype",
}
var validOperators = []string{"<", ">", "=", "<=", ">=", "!=", "like", "not like"}
var validConnectors = []string{"and", "or"}
var validDirections = []string{"asc", "desc"}

func contains(s []string, e string) bool {
	for _, a := range s {
		if strings.ToLower(a) == strings.ToLower(e) {
			return true
		}
	}
	return false
}

func addValidOperator(operator string, list []string, query string) (string, error) {
	if contains(list, operator) {
		query += " " + operator + " "
		return query, nil
	} else {
		return query, errors.New("Bad operator " + operator + ". Expected " + strings.Join(list, ","))
	}
}
