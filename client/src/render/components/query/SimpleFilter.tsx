import { cloneDeep } from "lodash"
import React, { useState } from "react"
import { Group, Node } from "../../../models/filter"
import { Rule } from "../../../models/rules"
import { InputType, TInputItem } from "../../types/input"
import InputItem from "./simple/InputItem"
import { v4 as uuidv4 } from 'uuid'
import { Input } from "../util/Input"

interface PropTypes {
  tree: Node
  updateTree: (group: Group) => void
  limit: number | null
  setLimit: (value: number | null) => void
  loading: boolean
  exportData: () => void
}

const config: TInputItem[] = [
  {
    type: InputType.MIN_MAX,
    key: "Cs",
    label: "CS",
    min: 0,
    max: 10,
    step: 0.1,
    defaultValue: [0, 10]
  },
  {
    type: InputType.MIN_MAX,
    key: "Ar",
    label: "AR",
    min: 0,
    max: 10,
    step: 0.1,
    defaultValue: [0, 10]
  },
]

const keyMap = new Map<string, string>([
  ["cs", "Cs"],
  ["ar", "Ar"]
])

const treeIsCompatibleWithSimpleMode = (group: Group) => {
  return true
}

const convertTreeToSimpleMode = (group: Group) => group

const shouldSkipText = (rule: Rule) => {
  if (rule.operator === ">=" || rule.operator === "<=") {
    return rule.value === "0" || rule.value === "10"
  }

  return false
}

const convertTreeToText = (tree: Node) => {
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

export const SimpleFilter: React.FC<PropTypes> = ({ tree, updateTree, limit, setLimit, loading, exportData }) => {
  if (tree.group && !treeIsCompatibleWithSimpleMode(tree.group)) {
    updateTree(convertTreeToSimpleMode(tree.group))
  }

  const [textInput, setTextInput] = useState(convertTreeToText(tree))

  console.log(tree)

  const handleChange = (value: string | number[], item: TInputItem) => {
    const currentValue = getValue(item)

    switch (item.type) {
      case InputType.MIN_MAX:
        const [newMin, newMax] = value as number[]
        const [currentMin, currentMax] = currentValue

        if (newMin !== currentMin) updateValuePair(item.key, ">=", newMin.toString())
        if (newMax !== currentMax) updateValuePair(item.key, "<=", newMax.toString())
    }
  }

  const updateValuePair = (type: string, symbol: string, number: string, state?: Node) => {
    const clone = cloneDeep(state ? state : tree)
    if (!clone.group) return

    const realKey = keyMap.get(type.toLowerCase())
    if (!realKey) return clone

    const children = clone.group.children.filter(child => {
      if (type !== child?.rule?.field) return true
      if (symbol === ">=" && child?.rule?.operator === ">") return false
      if (symbol === "<=" && child?.rule?.operator === "<") return false
      return true
    })
    clone.group.children = children

    updateTree(clone.group)
    for (const child of children) {
      const rule = child.rule
      if (!rule) continue

      if (rule.field === realKey && rule.operator === symbol) {
        if (rule.value === number) return clone
        rule.value = number
        setTextInput(convertTreeToText(clone))
        updateTree(clone.group)
        return clone
      }
    }

    const newRule: Node = {
      id: uuidv4(),
      rule: {
        field: realKey,
        value: number,
        operator: symbol,
        type: 1
      }
    }

    clone.group.children.push(newRule)
    updateTree(clone.group)
    setTextInput(convertTreeToText(clone))
    return clone
  }

  const handleTextChange = (text: string) => {
    const terms = text.toLowerCase().split(" ")
    const contents: { type: string, symbol: string, number: string }[] = []
    let state: Node | undefined = cloneDeep(tree)

    for (const term of terms) {
      if (term.match(/^\w*(<|<=|>|>=|==|=|!=)\d+\.?\d*$/g)) {
        let type = (term.match(/^\w+/g) ?? ["stars"])[0] // gets the word before operator
        const symbol = (term.match(/(<=|<|>=|>|==|=|!=)/g) ?? ">=")[0] // gets operator
        const number = (term.match(/\d+\.?\d*$/g) ?? ["0"])[0] // gets number after operator
        if (type === "length") { type = "drain" }
        if (type === "stars") { type = "sr" }
        if (type === "keys") { type = "cs" }
        contents.push({ type, symbol, number })
        state = updateValuePair(type, symbol, number, state)
      }
    }

    if (!state || !state.group) return console.log("a")

    const children = state.group.children.filter(child => {
      for (const content of contents) {
        const rule = child.rule
        if (!rule) return true
        if (
          rule.field.toLowerCase() === content.type &&
          rule.operator === content.symbol &&
          rule.value === content.number
        ) return true
      }

      return false
    }) ?? []

    updateTree({
      ...state.group,
      children
    })

    setTextInput(text)
  }

  const getRules = (key?: string): Rule[] => {
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

  const getValue = (item: TInputItem) => {
    const rules = getRules(item.key)

    switch (item.type) {
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
    }

    return [0, 10]
  }

  return (
    <div className="container flex flex-col gap-2">

      <div className="flex items-center">
        <label className="w-32">Text Input</label>
        <Input
          placeholder="Use osu! search terms e.g. cs>5 ar=8"
          value={textInput}
          onChange={(t) => handleTextChange(t)}
        />
      </div>

      {config.map(item => (
        <InputItem {...item} onChange={(value) => handleChange(value, item)} value={getValue(item)} />
      ))}
    </div>
  )
}
