import React, { useCallback } from "react"
import { QueryGroup } from "./advanced/QueryGroup"
import { Group, Node } from "../../../models/filter";
import { ShareFilter } from "./ShareFilter";

interface PropTypes {
  tree: Node
  updateTree: (group: Group) => void
}

export const AdvancedFilter: React.FC<PropTypes> = ({ tree, updateTree }) => {
  return (
    <div className="content-box mt-0 flex flex-col gap-4">
      <span className="font-bold text-lg dark:text-white">Query Builder</span>
      <ShareFilter tree={tree} updateTree={updateTree} />
      {tree.group && (
        <QueryGroup
          group={tree.group}
          id={tree.id}
          updateParent={(child) => updateTree(child)}
        />
      )}
    </div>
  )
}
