import { useEffect, useState } from "react"
import { FilterRequest } from "../../models/api"
import { RuleType } from "../../models/filter"
import { ConnectorDetails } from "../components/Connector"
import { QueryGroup } from "../components/QueryGroup"
import { Rule } from "../components/Rule"

export interface Group {
  connector: ConnectorDetails,
  children: Node[]
}

export interface Node {
  id: string,
  group?: Group
  rule?: Rule
}

const sampleTree: Node = {
  id: "root",
  group: {
    connector: {
      type: "AND",
      not: false
    },
    children: [
      {
        id: "1",
        rule: {
          type: RuleType.STATUS,
          value: "ranked",
          operator: "=",
          field: "Approved"
        }
      },
    ]
  }
}

export const Home = () => {
  const [tree, setTree] = useState<Node>(sampleTree)

  const exportData = () => {
    const output: FilterRequest = {
      groups: [],
      rules: []
    }

    const map = new Map<RuleType, string>([
      [RuleType.STATUS, "Text"],
      [RuleType.GENRE, "Text"],
      [RuleType.MODE, "Text"],
      [RuleType.LANGUAGE, "Text"],
      [RuleType.DATE, "Numeric"],
      [RuleType.NUMBER, "Numeric"],
      [RuleType.TEXT, "Text"]
    ])

    // flatten the tree into the output filter request
    const flatten = (node: Node, parent: number) => {
      if ("group" in node) {
        output.groups.push({
          connector: node.group.connector.type,
          not: node.group.connector.not,
          parent: parent,
          number: parent+1
        })
        node.group.children.forEach(child => flatten(child, parent+1))
      } else {
        output.rules.push({
          type: map.get(node.rule.type),
          field: node.rule.field,
          value: node.rule.value,
          operator: node.rule.operator,
          group: parent,
        })
      }
    }

    flatten(tree, 0)
    console.log(output)
  }

  const updateTree = (group: Group) => {
    setTree({ ...tree, group })
  }

  return (
    <div className="flex flex-col gap-2 items-start">
      <QueryGroup group={tree.group} id={tree.id} updateParent={(child) => updateTree(child)} />
      <button className="bg-blue-600 rounded hover:bg-blue-700 transition duration-150 px-2 py-1 ml-2 text-white font-medium" onClick={exportData}>Test Query</button>
    </div>

  )
}
