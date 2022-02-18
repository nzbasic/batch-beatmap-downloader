import Select from "react-select"
import { inputOptions, Rule, RuleType } from "../../../models/rules"

interface PropTypes {
  rule: Rule,
  onChange: (rule: Rule) => void
}

export const RuleSelector = ({ rule, onChange }: PropTypes) => {
  const defaultValues = new Map<RuleType, string>([
    [RuleType.STATUS, "ranked"],
    [RuleType.BOOLEAN, "1"],
    [RuleType.DATE, new Date().getTime().toString()],
    [RuleType.NUMBER, "1"],
    [RuleType.TEXT, ""],
    [RuleType.GENRE, "any"],
    [RuleType.LANGUAGE, "any"]
  ])

  const defaultOperators = new Map<RuleType, string>([
    [RuleType.STATUS, "="],
    [RuleType.BOOLEAN, "="],
    [RuleType.DATE, "<"],
    [RuleType.NUMBER, "="],
    [RuleType.TEXT, "like"],
    [RuleType.GENRE, "="],
    [RuleType.LANGUAGE, "="]
  ])

  return <Select
    className="w-52 my-react-select-container"
    classNamePrefix="my-react-select"
    options={inputOptions}
    defaultValue={inputOptions.find(i => i.value === rule.field)}
    onChange={(option) => onChange({ field: option.value, type: option.type, value: defaultValues.get(option.type), operator: defaultOperators.get(option.type) })}
  />
}
