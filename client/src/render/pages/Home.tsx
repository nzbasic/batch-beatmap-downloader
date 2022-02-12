import { useState } from "react"
import { RuleType } from "../../models/filter"
import { QueryGroup } from "../components/QueryGroup"
import { Node, Group } from '../../models/filter'
import { cloneDeep } from "lodash"
import { ResultTable } from "../components/ResultTable"
import { CircularProgress } from "@mui/material"

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
  const [result, setResult] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [firstQuery, setFirstQuery] = useState(true)

  const exportData = async () => {
    setResult([])
    setLoading(true)

    const map = new Map<RuleType, string>([
      [RuleType.STATUS, "Text"],
      [RuleType.GENRE, "Text"],
      [RuleType.MODE, "Text"],
      [RuleType.LANGUAGE, "Text"],
      [RuleType.DATE, "Numeric"],
      [RuleType.NUMBER, "Numeric"],
      [RuleType.TEXT, "Text"]
    ])

    // replace all rule types with the correct string from the Map
    const replaceRuleType = (node: Node) => {
      if ("rule" in node) {
        node.rule.type = map.get(node.rule.type as RuleType)
      }
      if ("group" in node) {
        node.group.children.forEach(replaceRuleType)
      }
    }

    const clone = cloneDeep(tree)
    replaceRuleType(clone)
    const res = await window.electron.query(clone)
    setLoading(false)
    setResult(res)
    setFirstQuery(false)
  }

  const updateTree = (group: Group) => {
    setTree({ ...tree, group })
  }

  return (
    <div className="flex flex-col gap-2 ">
      <div className="bg-white rounded shadow p-6 m-4 flex flex-col">
        <span className="font-bold text-lg">Advanced Query Builder</span>
        <span className="font-bold text-gray-500 mt-4">Filters</span>
        <QueryGroup group={tree.group} id={tree.id} updateParent={(child) => updateTree(child)} />
        <div className="flex gap-2 items-center mt-4">
          <button className="bg-blue-600 self-start rounded hover:bg-blue-700 transition duration-150 px-2 py-1 text-white font-medium" onClick={exportData}>Test Query</button>
          {loading ? <CircularProgress size={25} /> : !firstQuery && <span>{result.length} Results</span>}
        </div>
      </div>

      {result.length ?
        <div className="bg-white rounded shadow p-6 m-4 mt-0">
          <ResultTable result={result} />
        </div>
      : null}
    </div>

  )
}
