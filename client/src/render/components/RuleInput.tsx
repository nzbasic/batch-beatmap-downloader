import { useEffect, useState } from "react"
import Select from "react-select"
import { InputType, RuleType } from "../../models/filter"
import { Rule } from "./Rule"

interface Option {
  label: string;
  value: string;
}

const inputTypeMap = new Map<RuleType, InputType>([
  [RuleType.NUMBER, InputType.NUMBER],
  [RuleType.TEXT, InputType.TEXT],
  [RuleType.STATUS, InputType.DROPDOWN],
  [RuleType.GENRE, InputType.DROPDOWN],
  [RuleType.MODE, InputType.DROPDOWN],
  [RuleType.LANGUAGE, InputType.DROPDOWN],
  [RuleType.DATE, InputType.DATE],
])

const dropdownMap = new Map<RuleType, Option[]>([
  [
    RuleType.STATUS,
    [
      { value: "ranked", label: "Ranked" },
      { value: "loved", label: "Loved" },
    ]
  ],
  [
    RuleType.GENRE,
    [
      { value: "unspecified", label: "Unspecified" },
      { value: "video game", label: "Video Game" },
      { value: "anime", label: "Anime" },
      { value: "rock", label: "Rock" },
      { value: "pop", label: "Pop" },
      { value: "other", label: "Other" },
      { value: "novelty", label: "Novelty" },
      { value: "hip hop", label: "Hip Hop" },
      { value: "electronic", label: "Electronic" },
    ]
  ],
  [
    RuleType.MODE,
    [
      { value: "osu!", label: "osu!" },
      { value: "Taiko", label: "osu!taiko" },
      { value: "Catch the Beat", label: "osu!catch" },
      { value: "osu!mania", label: "osu!mania" },
    ]
  ],
  [
    RuleType.LANGUAGE,
    [
      { value: "other", label: "Other" },
      { value: "English", label: "English" },
      { value: "Japanese", label: "Japanese" },
      { value: "Chinese", label: "Chinese" },
      { value: "instrumental", label: "Instrumental" },
      { value: "Korean", label: "Korean" },
      { value: "French", label: "French" },
      { value: "German", label: "German" },
      { value: "Swedish", label: "Swedish" },
      { value: "Spanish", label: "Spanish" },
      { value: "Italian", label: "Italian" },
    ],
  ],
])

interface PropTypes {
  rule: Rule,
  onChange: (rule: Rule) => void
}

const RuleInputDropdown = ({ rule, onChange }: PropTypes) => {
  const [selectedOption, setSelectedOption] = useState<Option>(null)

  useEffect(() => {
    const option = dropdownMap.get(rule.type).find(i => i.value === rule.value)
    if (!option) {
      setSelectedOption(dropdownMap.get(rule.type)[0])
    } else {
      setSelectedOption(option)
    }
  }, [rule])

  return (
    <Select
      className="w-40"
      options={dropdownMap.get(rule.type)}
      value={selectedOption}
      onChange={(e) => onChange({ ...rule, value: e.value })}
    />
  )
}

const RuleInputNumber = ({ rule, onChange }: PropTypes) => {
  return (
    <input
      className="input-height p-2 w-40 border-gray-300 border rounded focus:border-blue-500"
      type="number"
      defaultValue={rule.value}
      onChange={(e) => onChange({ ...rule, value: e.target.value })}
    />
  )
}

const RuleInputText = ({ rule, onChange }: PropTypes) => {
  return (
    <input
      className="input-height p-2 w-40 border-gray-300 border rounded focus:outline-blue-500"
      defaultValue={rule.value}
      onChange={(e) => onChange({ ...rule, value: e.target.value })}
    />
  )
}

const RuleInputDate = ({ rule, onChange }: PropTypes) => {
  return (
    <input
      className="input-height p-2 w-40 border-gray-300 border rounded focus:outline-blue-500"
      type="date"
      defaultValue={rule.value}
      onChange={(e) => onChange({ ...rule, value: e.target.value })}
    />
  )
}

export const RuleInput = ({ rule, onChange }: PropTypes) => {
  const inputMap = new Map<InputType, JSX.Element>([
    [InputType.NUMBER, <RuleInputNumber rule={rule} onChange={onChange} />],
    [InputType.TEXT, <RuleInputText rule={rule} onChange={onChange} />],
    [InputType.DROPDOWN, <RuleInputDropdown rule={rule} onChange={onChange} />],
    [InputType.DATE, <RuleInputDate rule={rule} onChange={onChange} />],
  ])

  return (
    <div className="">
      {inputMap.get(inputTypeMap.get(rule.type))}
    </div>
  )
}
