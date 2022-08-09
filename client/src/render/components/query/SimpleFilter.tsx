import { cloneDeep } from "lodash"
import React, { useState } from "react"
import { Group, Node } from "../../../models/filter"
import {
  sections,
  InputType,
  TInputItem,
  Section,
  keyMap,
  getValue,
  convertTreeToSimpleMode,
  treeIsCompatibleWithSimpleMode,
  convertTreeToText,
  getType
} from "../../../models/simple"
import InputItem from "./simple/InputItem"
import { v4 as uuidv4 } from 'uuid'
import { Input } from "../util/Input"
import classNames from "classnames"

interface PropTypes {
  tree: Node
  updateTree: (group: Group) => void
  limit: number | null
  setLimit: (value: number | null) => void
  loading: boolean
  exportData: () => void
}

export const SimpleFilter: React.FC<PropTypes> = ({ tree, updateTree, limit, setLimit, loading, exportData }) => {
  if (tree.group && !treeIsCompatibleWithSimpleMode(tree.group)) {
    updateTree(convertTreeToSimpleMode(tree.group))
  }

  const [section, setSection] = useState<Section>(sections[0])
  const [textInput, setTextInput] = useState(convertTreeToText(tree))

  const handleChange = (value: string | boolean | number[], item: TInputItem) => {
    const currentValue = getValue(tree, item)

    switch (item.type) {
      case InputType.MIN_MAX:
        const [newMin, newMax] = value as number[]
        const [currentMin, currentMax] = currentValue as number[]

        if (newMin !== currentMin) updateValuePair(item.key, ">=", newMin.toString())
        if (newMax !== currentMax) updateValuePair(item.key, "<=", newMax.toString())
      case InputType.TEXT:
        const string = value as string
        const current = currentValue as string
        if (string !== current) updateValuePair(item.key, "=", string)
    }
  }

  const updateValuePair = (type: string, symbol: string, value: string, state?: Node) => {
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
        if (rule.value === value) return clone
        rule.value = value
        setTextInput(convertTreeToText(clone))
        updateTree(clone.group)
        return clone
      }
    }

    const newRule: Node = { id: uuidv4(), rule: { field: realKey, value, operator: symbol, type: getType(realKey) } }
    clone.group.children.push(newRule)
    updateTree(clone.group)
    setTextInput(convertTreeToText(clone))
    return clone
  }

  const handleTextChange = (text: string) => {
    const terms = text.toLowerCase().split(" ")
    const contents: { type: string, symbol: string, value: string }[] = []
    let state: Node | undefined = cloneDeep(tree)

    for (const term of terms) {
      if (term.match(/^\w*(<|<=|>|>=|==|=|!=)\d+\.?\d*$/g)) { // numeric
        const type = (term.match(/^\w+/g) ?? ["stars"])[0] // gets the word before operator
        const symbol = (term.match(/(<=|<|>=|>|==|=|!=)/g) ?? ">=")[0] // gets operator
        const value = (term.match(/\d+\.?\d*$/g) ?? ["0"])[0] // gets number after operator
        contents.push({ type, symbol, value })
        state = updateValuePair(type, symbol, value, state)
      } else if (term.match(/^\w*(==|=|!=)\w+$/g)) { // text
        const type = (term.match(/^\w+/g) ?? ["status"])[0] // gets the word before operator
        const symbol = (term.match(/(==|=|!=)/g) ?? [])[0] // gets operator
        const value = (term.match(/\w+$/g) ?? [])[0] // gets word after operator
        contents.push({ type, symbol, value })
        state = updateValuePair(type, symbol, value, state)
      }
    }

    if (!state || !state.group) return
    const children = state.group.children.filter(child => {
      for (const content of contents) {
        const rule = child.rule
        if (!rule) return true
        if (
          rule.field.toLowerCase() === content.type &&
          rule.operator === content.symbol &&
          rule.value === content.value
        ) return true
      }

      return false
    }) ?? []

    setTextInput(text)
    updateTree({
      ...state.group,
      children
    })
  }

  return (
    <div className="container flex flex-col gap-4">
      <div className="flex items-center">
        <label className="w-32">Text Input</label>
        <Input
          placeholder="Use osu! search terms e.g. cs>5 ar=8"
          value={textInput}
          onChange={(t) => handleTextChange(t)}
        />
      </div>

      <div className="flex items-center gap-2 w-full justify-between">
        {sections.map(item => (
          <div
            key={item.title}
            className={classNames(
              { 'bg-emerald-600 pointer-events-none': section.title === item.title },
              "w-full bg-sky-500 p-1 text-center text-white py-2 rounded font-medium hover:bg-sky-600 cursor-pointer")}
            onClick={() => setSection(item)}
          >
            {item.title}
          </div>
        ))}
      </div>

      {section.items.map(item => (
        <InputItem {...item} onChange={(value) => handleChange(value, item)} value={getValue(tree, item)} />
      ))}
    </div>
  )
}
