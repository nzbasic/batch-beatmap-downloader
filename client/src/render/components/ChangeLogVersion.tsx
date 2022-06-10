import { ChangeLogItem } from "../assets/changelog"
import { SimpleSummaryAccordion } from "./SimpleSummaryAccordion"

interface PropTypes {
  item: ChangeLogItem
}

export const ChangeLogVersion = ({ item }: PropTypes) => {
  return (
    <SimpleSummaryAccordion expanded title={item.version}>
      <ul>
        {item.changes.map((change, index) => (
          <li key={index}>
            {change}
          </li>
        ))}
      </ul>
    </SimpleSummaryAccordion>
  )
}
