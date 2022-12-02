import { Group, Node } from './filter'
import { dropdownMap, DropdownOption, inputOptions, Rule, RuleType } from './rules';

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

export interface DropdownValue {
  not: boolean;
  option: DropdownOption;
}

export type TInputItemDropdown = TInputItemBase & {
  type: InputType.DROPDOWN;
  options: DropdownOption[];
  defaultValue: DropdownValue;
  warning?: string;
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
  category: string;
  defaultValue: boolean | undefined;
}

export type TInputItem = TInputItemText | TInputItemDropdown | TInputItemMinMax | TInputItemSlider | TInputItemSwitch;

export interface Section {
  title: string
  items: TInputItem[]
}

export const keyMap = new Map<string, string>([
  ["status", "Approved"],
  ["approved", "Approved"],
  ["archetype", "Archetype"],
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
  ["maxcombo", "MaxCombo"],
  ["drain", "HitLength"],
  ["length", "HitLength"],
  ["source", "Source"],
  ["tags", "Tags"],
  ["genre", "Genre"],
  ["language", "Language"],
  ["favouritecount", "FavouriteCount"],
  ["favourites", "FavouriteCount"],
  ["favorites", "FavouriteCount"],
  ["passes", "PassCount"],
  ["passcount", "PassCount"],
  ["plays", "PlayCount"],
  ["playcount", "PlayCount"],
  ["special", "Special"],
  ["farm", "Special"],
  ["stream", "Special"],
  ["rankedmapper", "Special"],
])

export const valueMap = new Map<string, string>([
  ["r", "ranked"],
  ['u', 'unranked'],
  ['l', 'loved'],
  ['o', 'osu!'],
  ['t', 'Taiko'],
  ['c', 'Catch the Beat'],
  ['m', 'osu!mania'],
  ['english', 'English'],
  ['japanese', 'Japanese'],
  ['chinese', 'Chinese'],
  ['korean', 'Korean'],
  ['french', 'French'],
  ['german', 'German'],
  ['swedish', 'Swedish'],
  ['spanish', 'Spanish'],
  ['italian', 'Italian'],
  ['nm1', 'NM1'],
  ['nm2', 'NM2'],
  ['nm3', 'NM3'],
  ['nm4', 'NM4'],
  ['nm5', 'NM5'],
  ['nm6', 'NM6'],
  ['hd1', 'HD1'],
  ['hd2', 'HD2'],
  ['hd3', 'HD3'],
  ['hd4', 'HD4'],
  ['dt1', 'DT1'],
  ['dt2', 'DT2'],
  ['dt3', 'DT3'],
  ['dt4', 'DT4'],
  ['hr1', 'HR1'],
  ['hr2', 'HR2'],
  ['hr3', 'HR3'],
  ['hr4', 'HR4'],
  ['fm1', 'FM1'],
  ['fm2', 'FM2'],
  ['fm3', 'FM3'],
  ['fm4', 'FM4'],
  ['tb1', 'TB'],
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

  if (realKey === "Special") return rules.filter(rule => rule.value === key)
  return rules.filter(rule => rule.field === realKey)
}

export const textAliasMap = new Map<string, string>([
  ['osu!', 'o'],
  ['o', 'osu!'],
  ['Taiko', 't'],
  ['t', 'Taiko'],
  ['Catch the Beat', 'c'],
  ['c', 'Catch the Beat'],
  ['osu!mania', 'm'],
  ['m', 'osu!mania'],
  ['Approved', 'status'],
  ['status', 'Approved'],
  ['r', 'ranked'],
  ['Ranked', 'r'],
  ['u', 'Unranked'],
  ['Unranked', 'u'],
  ['l', 'loved'],
  ['Loved', 'l'],
  ['video game', 'game'],
  ['game', 'video game'],
  ['hip hop', 'hiphop'],
  ['hiphop', 'hip hop'],
  ['HasLeaderboard', 'leaderboard'],
  ['leaderboard', 'HasLeaderboard'],
]);

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
    case InputType.DROPDOWN:
      if (!rules.length) return item.defaultValue
      const dropdownRule = rules[0]
      const found = item.options.find(option => option.value === dropdownRule.value)
      if (!found) return item.defaultValue

      const value: DropdownValue = {
        not: dropdownRule.operator === "!=",
        option: found
      }

      return value
    case InputType.SWITCH:
      if (!rules.length) return item.defaultValue
      const switchRule = rules[0];
      return switchRule.operator === "="
  }
}

export const treeIsCompatibleWithSimpleMode = (group: Group) => {
  if (group.connector.type === "OR") return false;
  if (group.connector.not.length) return false;

  // traverse tree, if there is a sub group containing more than one child, return False
  const traverse = (node: Node): boolean => {
    if (!node.group) return true
    if (node.group.connector.not.length) return false
    if (node.group.children.length > 1) return false
    return traverse(node.group.children[0])
  }

  for (const child of group.children) {
    if (!traverse(child)) return false
  }

  return true
}

export const convertTreeToSimpleMode = (group: Group) => {
  const newGroup: Group = {
    connector: {
      type: "AND",
      not: [],
    },
    children: []
  }

  // flatten the tree by moving all rules to the root
  const traverse = (node: Node) => {
    if (node.group && node.group.children.length) {
      traverse(node.group.children[0])
    } else {
      newGroup.children.push({ ...node })
    }
  }

  for (const child of group.children) {
    traverse(child)
  }

  return newGroup;
}

export const shouldSkipText = (rule: Rule) => {
  if (rule.type === RuleType.SLIDER && (rule.operator === ">=" || rule.operator === "<=")) {
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

    const field = textAliasMap.get(rule.field) ?? rule.field
    const value = textAliasMap.get(rule.value) ?? rule.value
    const operator = rule.operator === "like" ? "=" : rule.operator;
    output += `${field}${operator}${value} `.toLowerCase()
  }

  return output.trim()
}

export const aboveSection: Section = {
  title: "Above",
  items: [
    {
      type: InputType.DROPDOWN,
      key: "Mode",
      label: "Mode",
      options: dropdownMap.get(RuleType.MODE) ?? [],
      defaultValue: { option: { value: "any", label: "Any" }, not: false },
      warning: "You may want to set this to your game mode"
    },
    {
      type: InputType.DROPDOWN,
      key: "Approved",
      label: "Status",
      options: dropdownMap.get(RuleType.STATUS) ?? [],
      defaultValue: { option: { value: "any", label: "Any" }, not: false },
      warning: "You should probably set this"
    },
  ],
};

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
        type: InputType.DROPDOWN,
        label: "Genre",
        key: "Genre",
        options: dropdownMap.get(RuleType.GENRE) ?? [],
        defaultValue: { option: { value: "any", label: "Any" }, not: false },
      },
      {
        type: InputType.DROPDOWN,
        label: "Language",
        key: "Language",
        options: dropdownMap.get(RuleType.LANGUAGE) ?? [],
        defaultValue: { option: { value: "any", label: "Any" }, not: false },
      },
      {
        type: InputType.MIN_MAX,
        label: "Favourites",
        key: "FavouriteCount",
        defaultValue: [-1, -1],
        step: 1
      },
      {
        type: InputType.MIN_MAX,
        label: "Plays",
        key: "PlayCount",
        defaultValue: [-1, -1],
        step: 1
      },
      {
        type: InputType.MIN_MAX,
        label: "Passes",
        key: "PassCount",
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
    ],
  },
  {
    title: 'Special',
    items: [
      {
        type: InputType.DROPDOWN,
        key: "Archetype",
        label: "Archetype",
        options: dropdownMap.get(RuleType.TOURNAMENT) ?? [],
        defaultValue: { option: { value: "None", label: "None" }, not: false },
      },
      {
        type: InputType.SWITCH,
        key: "Farm",
        label: "Farm",
        category: "Special",
        defaultValue: undefined
      },
      {
        type: InputType.SWITCH,
        key: "Stream",
        label: "Stream",
        category: "Special",
        defaultValue: undefined
      },
      {
        type: InputType.SWITCH,
        key: "RankedMapper",
        label: "Ranked Mapper",
        category: "Special",
        defaultValue: undefined
      }
    ],
  },
]
