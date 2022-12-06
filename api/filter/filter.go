package filter

import (
	"errors"
	"fmt"
	"strings"

	"github.com/nzbasic/batch-beatmap-downloader/api/database"
)

type ConnectorDetails struct {
	Type string
	Not  []string
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

func QueryNode(node Node, limit *int, by *string, direction *string) ([]int, []int, map[int]int, []string, error) {
	var values = []string{}
	query := "SELECT id, setId, size, hash FROM beatmaps"
	if len(node.Group.Children) > 0 {
		query += " WHERE "
		built, err := RecursiveQueryBuilder(node, &values)
		if err != nil {
			return nil, nil, nil, nil, err
		}

		query += built
	}

	if by != nil && direction != nil {
		if !contains(validColumnNames, *by) {
			return nil, nil, nil, nil, errors.New("Bad column name " + *by + ". Expected " + strings.Join(validColumnNames, ","))
		}

		if !contains(validDirections, *direction) {
			return nil, nil, nil, nil, errors.New("Bad direction " + *direction + ". Expected " + strings.Join(validDirections, ","))
		}

		query += fmt.Sprintf(" ORDER BY %s %s", *by, *direction)
	}

	if limit != nil {
		query += " LIMIT ? "
		values = append(values, fmt.Sprintf("%d", *limit))
	}

	ids, setIds, sizeMap, hashes, err := database.QueryIds(query, values)
	if err != nil {
		return ids, setIds, sizeMap, hashes, errors.New("Invalid query " + query)
	}

	return ids, setIds, sizeMap, hashes, nil
}

func RecursiveQueryBuilder(node Node, values *[]string) (string, error) {
	queryAddition := ""
	if node.Rule.Type == "" { // node is a group
		queryAddition += " ("
		for index, child := range node.Group.Children {
			addition, err := RecursiveQueryBuilder(child, values)
			if err != nil {
				return "", err
			}

			queryAddition += addition
			if index != len(node.Group.Children)-1 {
				if !contains(validConnectors, node.Group.Connector.Type) {
					return "", errors.New("Invalid connector type " + node.Group.Connector.Type)
				}

				queryAddition += " " + node.Group.Connector.Type + " "
				nextChild := node.Group.Children[index+1]
				if contains(node.Group.Connector.Not, nextChild.Id) {
					queryAddition += "NOT "
				}
			}
		}
		queryAddition += ")"
	} else { // node is a rule
		if node.Rule.Field == "Approved" && node.Rule.Value == "HasLeaderboard" {
			return "(approved = 'ranked' or approved = 'loved' or approved = 'approved')", nil
		}

		if node.Rule.Field == "Approved" && strings.ToLower(node.Rule.Value) == "unranked" {
			return "(approved = 'WIP' or approved = 'graveyard' or approved = 'pending')", nil
		}

		if node.Rule.Field == "Archetype" {
			if node.Rule.Operator == "=" {
				node.Rule.Operator = "like"
			} else {
				node.Rule.Operator = "not like"
			}
		}

		if strings.Contains(node.Rule.Operator, "like") {
			node.Rule.Value = "%" + node.Rule.Value + "%"
		}

		if !contains(validColumnNames, node.Rule.Field) {
			return "", errors.New("Invalid column name " + node.Rule.Field)
		}

		if !contains(validOperators, node.Rule.Operator) {
			return "", errors.New("Invalid operator " + node.Rule.Operator)
		}

		*values = append(*values, node.Rule.Value)
		queryAddition += fmt.Sprintf("%s %s %s", node.Rule.Field, node.Rule.Operator, "?")
	}

	return queryAddition, nil
}
