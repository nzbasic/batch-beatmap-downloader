package filter

import (
	"errors"
	"fmt"
	"strings"

	"github.com/nzbasic/batch-beatmap-downloader/database"
)

type ConnectorDetails struct {
	Type string
	Not  bool
}

type Group struct {
	Connector ConnectorDetails
	Children  []Node
}

type Rule struct {
	Type     string
	Field    string
	Operator string
	Value    string
}

type Node struct {
	Id    string
	Group Group
	Rule  Rule
}

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

func QueryNode(node Node, limit *int) ([]int, []int, map[int]int, []string, error) {
	var values = []string{}
	query := "SELECT id, setId, size, hash FROM beatmaps WHERE"
	query += RecursiveQueryBuilder(node, &values)
	if limit != nil {
		query += " LIMIT " + fmt.Sprintf("%d", *limit)
	}

	ids, setIds, sizeMap, hashes, err := database.QueryIds(query, values)
	if err != nil {
		return ids, setIds, sizeMap, hashes, errors.New("Invalid query " + query)
	}

	return ids, setIds, sizeMap, hashes, nil
}

func RecursiveQueryBuilder(node Node, values *[]string) string {
	queryAddition := ""
	if node.Rule.Type == "" { // node is a group
		queryAddition += " ("
		for index, child := range node.Group.Children {
			queryAddition += RecursiveQueryBuilder(child, values)
			if index != len(node.Group.Children)-1 {
				queryAddition += " " + node.Group.Connector.Type + " "
			}
		}
		queryAddition += ")"
	} else { // node is a rule
		if node.Rule.Operator == "like" {
			node.Rule.Value = "%" + node.Rule.Value + "%"
		}

		*values = append(*values, node.Rule.Value)
		queryAddition += fmt.Sprintf("%s %s %s", node.Rule.Field, node.Rule.Operator, "?")
	}

	return queryAddition
}
