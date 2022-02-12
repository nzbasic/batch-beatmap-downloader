import { useEffect, useState } from "react"
import Select from "react-select"
import { Rule, RuleType } from "../../models/filter"

interface Operator {
  label: string,
  value: string
}

const defaultOperators = [
  { label: "is", value: "=" },
  { label: "is not", value: "!=" },
]

const operatorMap = new Map<RuleType, Operator[]>([
  [
    RuleType.TEXT,
    [
      { label: "exactly matches", value: "=" },
      { label: "contains", value: "like" },
    ]
  ],
  [
    RuleType.NUMBER,
    [
      { label: "is equal to", value: "=" },
      { label: "is not equal to", value: "!=" },
      { label: "is less than", value: "<" },
      { label: "is greater than", value: ">" },
      { label: "is less than or equal to", value: "<=" },
      { label: "is greater than or equal to", value: ">=" },
    ],
  ],
  [RuleType.STATUS, defaultOperators],
  [RuleType.GENRE, defaultOperators],
  [RuleType.MODE, defaultOperators],
  [RuleType.LANGUAGE, defaultOperators],
  [RuleType.DATE,
    [
      { label: "is before", value: "<" },
      { label: "is after", value: ">" },
    ]
  ],
])

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
    className="w-52"
    options={operatorMap.get(rule.type as RuleType)}
    isSearchable={false}
    value={selectedOption}
    onChange={(e) => onChange({ ...rule, operator: e.value })}
  />
}
