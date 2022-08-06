import React, { useState } from "react"
import { Group, Node } from "../../../models/filter"
import { useTextInput } from "../../hooks/useTextInput"
import { MinMaxInput } from "../util/MinMaxInput"

interface PropTypes {
  tree: Node
  updateTree: (group: Group) => void
  limit: number | null
  setLimit: (value: number | null) => void
  loading: boolean
  exportData: () => void
}

export const SimpleFilter: React.FC<PropTypes> = ({ tree, updateTree, limit, setLimit, loading, exportData }) => {
  const [values, setValues] = useState<number[]>([1, 5])

  return (
    <div className="container flex flex-col gap-2">
      Simple Filter
      <MinMaxInput step={0.1} min={0} max={10} values={values} onChange={setValues} />
    </div>
  )
}
