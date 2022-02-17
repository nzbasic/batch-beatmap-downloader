import { useEffect, useState } from "react"
import { RuleType } from "../../models/filter"
import { QueryGroup } from "../components/querybuilder/QueryGroup"
import { Node, Group } from '../../models/filter'
import { cloneDeep } from "lodash"
import { ResultTable } from "../components/querybuilder/ResultTable"
import { CircularProgress } from "@mui/material"
import { Settings } from "../components/Settings"
import { FilterResponse } from "../../models/api"
import { QueryLimit } from "../components/querybuilder/QueryLimit"
import { useStickyState } from "../hooks/stickystate"
import { DownloadSettings } from "../components/DownloadSettings"

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

export const Query = () => {
  const [tree, setTree] = useStickyState<Node>(sampleTree, "tree")
  const [result, setResult] = useState<FilterResponse>(null)
  const [loading, setLoading] = useState(false)
  const [firstQuery, setFirstQuery] = useState(true)
  const [limit, setLimit] = useState<number | null>(null)
  const [existing, setExisting] = useState<number[]>([])

  const exportData = async () => {
    setResult(null)
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
    const res = await window.electron.query(clone, limit)
    setLoading(false)
    setResult(res)
    setFirstQuery(false)
  }

  const updateTree = (group: Group) => {
    setTree({ ...tree, group })
  }

  return (
    <div className="flex flex-col w-full gap-4">
      <Settings onBeatmapsLoaded={(ids) => setExisting(ids)} />
      <div className="bg-white dark:bg-monokai-dark rounded shadow p-6 mt-0 flex flex-col gap-4">
        <span className="font-bold text-lg dark:text-white">Query Builder</span>
        <QueryGroup group={tree.group} id={tree.id} updateParent={(child) => updateTree(child)} />
        <QueryLimit limit={limit} updateLimit={(limit) => setLimit(limit)} />
        <div className="flex gap-2 items-center">
          <button disabled={loading} className="bg-blue-600 self-start rounded hover:bg-blue-700 transition duration-150 px-2 py-1 text-white font-medium" onClick={exportData}>Test Query</button>
          {loading && <CircularProgress size={25} />}
        </div>
      </div>

      {result?.Ids ?
        <div className="flex flex-col gap-4">
          <div className="bg-white dark:bg-monokai-dark rounded shadow p-6">
            <DownloadSettings result={result} existing={existing} />
          </div>
          <div className="bg-white dark:bg-monokai-dark rounded shadow p-6 mt-0 flex flex-col gap-4">
            <span className="font-bold text-lg dark:text-white">Results</span>
            <ResultTable result={result} />
          </div>
        </div>
      : null}
    </div>
  )
}
