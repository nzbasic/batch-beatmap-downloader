import { Group, Node } from './filter'
import { inputOptions, Rule, RuleType } from './rules';

export enum InputType {
  TEXT = "text",
  MIN_MAX = "minmax",
  SLIDER = "slider",
  DROPDOWN = "dropdown",
  SWITCH = "switch"
}

export type TInputItemBase = {
  key: string;
  label: string;
  required?: boolean;
};

export type TInputItemText = TInputItemBase & {
  type: InputType.TEXT;
  defaultValue: string,
};

export type TInputItemDropdown = TInputItemBase & {
  type: InputType.DROPDOWN;
  options: {
    label: string;
    value: string;
  }[];
  defaultValue: string;
};

export type TInputItemMinMax = TInputItemBase & {
  type: InputType.MIN_MAX;
  defaultValue: number[];
  step: number;
}

export type TInputItemSlider = TInputItemBase & {
  type: InputType.SLIDER;
  min: number;
  max: number;
  step: number
  defaultValue: number[]
}

export type TInputItemSwitch = TInputItemBase & {
  type: InputType.SWITCH;
  defaultValue: boolean;
}

export type TInputItem = TInputItemText | TInputItemDropdown | TInputItemMinMax | TInputItemSlider | TInputItemSwitch;

export interface Section {
  title: string
  items: TInputItem[]
}

export const keyMap = new Map<string, string>([
  ["status", "Approved"],
  ["archetype", "Archetype"],
  ["farm", "Farm"],
  ["stream", "Stream"],
  ["title", "Title"],
  ["artist", "Artist"],
  ["creator", "Creator"],
  ["version", "Version"],
  ["bpm", "Bpm"],
  ["hp", "Hp"],
  ["od", "Od"],
  ["ar", "Ar"],
  ["cs", "Cs"],
  ["keys", "Cs"],
  ["mode", "Mode"],
  ["stars", "Stars"],
  ["combo", "MaxCombo"],
  ["length", "HitLength"],
  ["source", "Source"],
  ["tags", "Tags"],
  ["genre", "Genre"],
  ["language", "Language"],
  ["favourites", "FavouriteCount"],
  ["favorites", "FavouriteCount"],
  ["passes", "PassCount"],
  ["plays", "PlayCount"]
])

export const getType = (type: string) => {
  for (const option of inputOptions) {
    if (option.value === type) {
      return option.type
    }
  }

  return RuleType.TEXT
}

export const getRules = (tree: Node, key?: string): Rule[] => {
  if (!tree.group) return []

  const rules: Rule[] = [];
  for (const child of tree.group.children) {
    if (child.rule) rules.push(child.rule)
  }
  if (!key) return rules

  const realKey = keyMap.get(key.toLowerCase())
  if (!realKey) return []
  return rules.filter(rule => rule.field === realKey)
}

export const getValue = (tree: Node, item: TInputItem) => {
  const rules = getRules(tree, item.key)

  switch (item.type) {
    case InputType.SLIDER:
    case InputType.MIN_MAX:
      const mins: number[] = []
      const maxs: number[] = []
      for (const rule of rules) {
        const op = rule.operator
        const val = parseFloat(rule.value)
        if (op === ">") mins.push(val + item.step)
        if (op === ">=") mins.push(val)
        if (op === "<") maxs.push(val - item.step)
        if (op === "<=") maxs.push(val)
        if (op === "=" || op === "==" || op === "!=") return [val, val]
      }

      mins.sort()
      maxs.sort()
      let [min, max] = item.defaultValue

      if (mins.length) min = mins[mins.length - 1]
      if (maxs.length) max = maxs[0]

      return [min, max]
    case InputType.TEXT:
      if (rules.length) return rules[0].value
      return ""
  }

  return [0, 10]
}

export const treeIsCompatibleWithSimpleMode = (group: Group) => {
  return true
}

export const convertTreeToSimpleMode = (group: Group) => group

export const shouldSkipText = (rule: Rule) => {
  if (rule.operator === ">=" || rule.operator === "<=") {
    return rule.value === "0" || rule.value === "10"
  }

  if (rule.type === RuleType.TEXT && rule.value === "") return true
  return false
}

export const convertTreeToText = (tree: Node) => {
  let output = ""
  if (!tree.group) return output;
  for (const child of tree.group.children) {
    if (!child.rule) continue
    const rule = child.rule

    if (shouldSkipText(rule)) continue
    output += `${rule.field.toLowerCase()}${rule.operator}${rule.value} `
  }

  return output.trim()
}

export const sections: Section[] = [
  {
    title: 'Difficulty Info',
    items: [
      {
        type: InputType.MIN_MAX,
        key: "Stars",
        label: "Stars",
        defaultValue: [-1, -1],
        step: 0.01
      },
      {
        type: InputType.MIN_MAX,
        key: "Bpm",
        label: "BPM",
        defaultValue: [-1, -1],
        step: 0.01
      },
      {
        type: InputType.SLIDER,
        key: "Cs",
        label: "CS",
        min: 0,
        max: 10,
        step: 0.1,
        defaultValue: [0, 10]
      },
      {
        type: InputType.SLIDER,
        key: "Ar",
        label: "AR",
        min: 0,
        max: 10,
        step: 0.1,
        defaultValue: [0, 10]
      },
      {
        type: InputType.SLIDER,
        key: "Hp",
        label: "HP",
        min: 0,
        max: 10,
        step: 0.1,
        defaultValue: [0, 10]
      },
      {
        type: InputType.SLIDER,
        key: "Od",
        label: "OD",
        min: 0,
        max: 10,
        step: 0.1,
        defaultValue: [0, 10]
      },
    ],
  },
  {
    title: 'Beatmap Info',
    items: [
      {
        type: InputType.TEXT,
        key: "Artist",
        label: "Artist",
        defaultValue: "",
      },
      {
        type: InputType.TEXT,
        key: "Title",
        label: "Title",
        defaultValue: "",
      },
      {
        type: InputType.TEXT,
        key: "Creator",
        label: "Mapper",
        defaultValue: "",
      },
      {
        type: InputType.DROPDOWN,
        key: "Mode",
        label: "Mode",
        options: [],
        defaultValue: "",
      },
      {
        type: InputType.MIN_MAX,
        key: "Drain",
        label: "Length",
        defaultValue: [-1, -1],
        step: 1,
      },
      {
        type: InputType.MIN_MAX,
        key: "MaxCombo",
        label: "Max Combo",
        defaultValue: [-1, -1],
        step: 1
      }
    ],
  },
  {
    title: 'Metadata',
    items: [
      {
        type: InputType.MIN_MAX,
        label: "FavouriteCount",
        key: "Favourites",
        defaultValue: [-1, -1],
        step: 1
      },
      {
        type: InputType.MIN_MAX,
        label: "PlayCount",
        key: "Plays",
        defaultValue: [-1, -1],
        step: 1
      },
      {
        type: InputType.MIN_MAX,
        label: "PassCount",
        key: "Passes",
        defaultValue: [-1, -1],
        step: 1
      },
      {
        type: InputType.TEXT,
        label: "Source",
        key: "Source",
        defaultValue: "",
      },
      {
        type: InputType.TEXT,
        label: "Tags",
        key: "Tags",
        defaultValue: "",
      },
      {
        type: InputType.DROPDOWN,
        label: "Genre",
        key: "Genre",
        options: [],
        defaultValue: ""
      },
      {
        type: InputType.DROPDOWN,
        label: "Language",
        key: "Language",
        options: [],
        defaultValue: ""
      },
    ],
  },
  {
    title: 'Custom',
    items: [
      {
        type: InputType.SWITCH,
        key: "Farm",
        label: "Farm",
        defaultValue: false
      },
      {
        type: InputType.SWITCH,
        key: "Stream",
        label: "Stream",
        defaultValue: false
      },
      {
        type: InputType.DROPDOWN,
        key: "Archetype",
        label: "Tournament",
        options: [],
        defaultValue: "",
      }
    ],
  },
]
