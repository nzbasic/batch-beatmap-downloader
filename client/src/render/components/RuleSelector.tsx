import Select from "react-select"
import { Rule, RuleType } from "../../models/filter"

interface Option {
  label: string
  value: string
  type: RuleType
}

const options: Option[] = [
  { value: "Approved", label: "Map Status", type: RuleType.STATUS },
  { value: "Title", label: "Song Title", type: RuleType.TEXT },
  { value: "Artist", label: "Artist", type: RuleType.TEXT },
  { value: "Creator", label: "Mapper", type: RuleType.TEXT },
  { value: "Version", label: "Difficulty", type: RuleType.TEXT },
  { value: "Bpm", label: "BPM", type: RuleType.NUMBER },
  { value: "Hp", label: "HP (Health Drain)", type: RuleType.NUMBER  },
  { value: "Od", label: "OD (Overall Difficulty)", type: RuleType.NUMBER  },
  { value: "Ar", label: "AR (Approach Rate)", type: RuleType.NUMBER  },
  { value: "Cs", label: "CS (Circle Size)", type: RuleType.NUMBER  },
  { value: "Mode", label: "Game Mode", type: RuleType.MODE },
  { value: "Stars", label: "Star Rating", type: RuleType.NUMBER  },
  { value: "MaxCombo", label: "Max Combo", type: RuleType.NUMBER  },
  { value: "HitLength", label: "Song Length (drain)", type: RuleType.NUMBER  },
  { value: "TotalLength", label: "Song Length (total)", type: RuleType.NUMBER  },
  { value: "Source", label: "Source", type: RuleType.TEXT },
  { value: "Tags", label: "Tags", type: RuleType.TEXT },
  { value: "Genre", label: "Genre", type: RuleType.GENRE },
  { value: "Language", label: "Language", type: RuleType.LANGUAGE },
  { value: "FavouriteCount", label: "Favourite Count", type: RuleType.NUMBER },
  { value: "PassCount", label: "Pass Count", type: RuleType.NUMBER  },
  { value: "PlayCount", label: "Play Count", type: RuleType.NUMBER  },
  { value: "ApprovedDate", label: "Approved Date", type: RuleType.DATE },
  { value: "LastUpdated", label: "Last Updated Date", type: RuleType.DATE },
  { value: "SetId", label: "Beatmap Set ID", type: RuleType.NUMBER  },
  { value: "Id", label: "Beatmap ID", type: RuleType.NUMBER  },
]

interface PropTypes {
  rule: Rule,
  onChange: (rule: Rule) => void
}

export const RuleSelector = ({ rule, onChange }: PropTypes) => {
  return <Select
    className="w-52 my-react-select-container"
    classNamePrefix="my-react-select"
    options={options}
    defaultValue={options.find(i => i.value === rule.field)}
    onChange={(option) => onChange({ ...rule, field: option.value, type: option.type, value: "" })}
  />
}
