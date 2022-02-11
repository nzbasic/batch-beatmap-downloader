package filter

import (
	"errors"
	"strconv"
	"strings"

	"github.com/nzbasic/batch-beatmap-downloader/database"
)

/*
User sends in some json data like this

[
	{
		type: "Numeric",
		operator: "=",
		field: "BPM",
		value: "240"
	},
	{
		type: "Text",
		operator: "like"
		field: "Title",
		value: "HONESTY"
	}
]

*/

type Filter struct {
	Type     string
	Operator string
	Field    string
	Value    string
}

var validOperatorsNumeric = []string{"<", ">", "<=", ">=", "=", "!="}
var validOperatorsText = []string{"like", "="}

func contains(s []string, e string) bool {
	for _, a := range s {
		if a == e {
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

func ParseFilters(filters []Filter) ([]int, error) {

	values := []string{}
	var err error
	var output []int
	query := "SELECT id FROM beatmaps WHERE (1=1) "
	for _, filter := range filters {
		if filter.Type == "Numeric" {
			query += "AND (" + filter.Field
			query, err = addValidOperator(filter.Operator, validOperatorsNumeric, query)
			if err != nil {
				return []int{}, err
			}

			_, err = strconv.ParseFloat(filter.Value, 64)
			if err != nil {
				return []int{}, errors.New("Error converting " + filter.Value + " to float64")
			}

			values = append(values, filter.Value)
			query += "?) "
		} else if filter.Type == "Text" {
			query += "AND (" + filter.Field
			query, err = addValidOperator(filter.Operator, validOperatorsText, query)
			if err != nil {
				return []int{}, err
			}

			if filter.Operator == "like" {
				filter.Value = "%" + filter.Value + "%"
			}

			values = append(values, filter.Value)
			query += "?) "
		} else {
			return []int{}, errors.New("No matching filter type found for " + filter.Type)
		}
	}

	output, err = database.QueryIds(query, values)
	if err != nil {
		return []int{}, errors.New("Invalid query " + query)
	}

	return output, nil
}
