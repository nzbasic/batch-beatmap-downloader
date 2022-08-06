import React from "react"
import { QueryGroup } from "./QueryGroup"
import { Group, Node } from "../../../models/filter";
import { QueryLimit } from "./QueryLimit";
import { CircularProgress } from "@mui/material";

interface PropTypes {
  tree: Node
  updateTree: (group: Group) => void
  limit: number | null
  setLimit: (value: number | null) => void
  loading: boolean
  exportData: () => void
}

export const AdvancedFilter: React.FC<PropTypes> = ({ tree, updateTree, limit, setLimit, loading, exportData }) => {

  return (
    <div className="container mt-0 flex flex-col gap-4">
      <span className="font-bold text-lg dark:text-white">Query Builder</span>
      <span>
        Large queries (queries that will return a lot of results) may take a
        lot of time (1-2mins) to load. Consider using a limit, or make your
        query more specific to get it loading faster.
      </span>
      {tree.group && (
        <QueryGroup
          group={tree.group}
          id={tree.id}
          updateParent={(child) => updateTree(child)}
        />
      )}
      <QueryLimit limit={limit} updateLimit={(limit) => setLimit(limit)} />
      <div className="flex gap-2 items-center">
        <button
          disabled={loading}
          className="bg-blue-600 self-start rounded hover:bg-blue-700 transition duration-150 px-2 py-1 text-white font-medium"
          onClick={exportData}
        >
          Search
        </button>
        {loading && <CircularProgress size={25} />}
      </div>
    </div>
  )
}
