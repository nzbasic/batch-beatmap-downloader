import { useEffect, useState } from "react"
import Select from "react-select"
import { Rule, RuleType, operatorMap, Operator } from "../../../models/rules"

interface PropTypes {
  rule: Rule,
  onChange: (rule: Rule) => void
}

export const RuleOperator = ({ rule, onChange }: PropTypes) => {
  const [selectedOption, setSelectedOption] = useState<Operator>(null)

  useEffect(() => {
    const option = operatorMap.get(rule.type as RuleType).find(i => i.value === rule.operator)
    if (!option) {
      setSelectedOption(operatorMap.get(rule.type as RuleType)[0])
    } else {
      setSelectedOption(option)
    }
  }, [rule])

 return <Select
    className="w-52 my-react-select-container"
    classNamePrefix="my-react-select"
    options={operatorMap.get(rule.type as RuleType)}
    isSearchable={false}
    value={selectedOption}
    onChange={(e) => onChange({ ...rule, operator: e.value })}
  />
}
