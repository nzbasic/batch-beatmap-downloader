import React from "react"
import { ChangeLogItem } from "../assets/changelog"
import { SimpleSummaryAccordion } from "./util/SimpleSummaryAccordion"

interface PropTypes {
  item: ChangeLogItem
}

export const ChangeLogVersion = ({ item }: PropTypes) => {
  return (
    <SimpleSummaryAccordion expanded title={item.version}>
      <div className="flex flex-col gap-4">
        {item.changes.map((change, index) => (
          <div key={index}>
            <span className="font-semibold">{change.title}</span>
            <ul className="list-disc list-inside">
              {change.changes.map((text, index) => (
                <li key={index}>{text}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SimpleSummaryAccordion>
  )
}
