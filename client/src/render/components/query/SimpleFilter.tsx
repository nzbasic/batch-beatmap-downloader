import { cloneDeep } from "lodash"
import React, { useEffect, useState } from "react"
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
  getType,
  DropdownValue,
  textAliasMap,
  valueMap,
  aboveSection
} from "../../../models/simple"
import InputItem from "./simple/InputItem"
import { nanoid } from 'nanoid'
import { Input } from "../util/Input"
import classNames from "classnames"

interface PropTypes {
  tree: Node
  updateTree: (group: Group) => void
}

type Value = string | boolean | number[] | DropdownValue | undefined

export const SimpleFilter: React.FC<PropTypes> = ({ tree, updateTree }) => {
  const [section, setSection] = useState<Section>(sections[0])
  const [textInput, setTextInput] = useState(convertTreeToText(tree))

  useEffect(() => {
    if (tree.group && !treeIsCompatibleWithSimpleMode(tree.group)) {
      const newTree = convertTreeToSimpleMode(tree.group)
      updateTree(newTree)
    }
  }, [])

  const handleChange = (value: Value, item: TInputItem) => {
    const currentValue = getValue(tree, item)

    switch (item.type) {
      case InputType.SLIDER:
      case InputType.MIN_MAX:
        const [newMin, newMax] = value as number[]
        const [currentMin, currentMax] = currentValue as number[]
        const [defaultMin, defaultMax] = item.defaultValue

        if (newMin >= 0 && newMin !== currentMin) updateValuePair(item.key, ">=", newMin.toString())
        if (newMax >= 0 && newMax !== currentMax) updateValuePair(item.key, "<=", newMax.toString())

        if (newMin === defaultMin && newMin !== currentMin) removeRule(item, ">")
        if (newMax === defaultMax && newMax !== currentMax) removeRule(item, "<")
        break
      case InputType.TEXT:
        const string = value as string
        if (!string) {
          removeRule(item, "like")
          break
        }

        if (string !== (currentValue as string)) updateValuePair(item.key, "like", string)
        break
      case InputType.DROPDOWN:
        const { option, not } = value as DropdownValue
        const { option: currentOption, not: currentNot } = currentValue as DropdownValue
        if (option.value !== currentOption.value || not != currentNot) {
          updateValuePair(item.key, not ? "!=" : "=", option.value)
        }

        if (!not && option.value === item.defaultValue.option.value) {
          removeRule(item, "=")
        }

        break
      case InputType.SWITCH:
        const boolean = value as boolean | undefined
        const operator = boolean ? "=" : "!="

        if (boolean === undefined) removeRule(item, "=");
        else updateValuePair(item.category, operator, item.key)
        break
    }
  }

  const updateValuePair = (type: string, symbol: string, value: string, state?: Node) => {
    const clone = cloneDeep(state ? state : tree)
    if (!clone.group) return

    const realKey = keyMap.get(type.toLowerCase())
    if (!realKey) return clone

    const realValue = valueMap.get(value) ?? value

    const children = clone.group.children.filter(child => {
      if (realKey === "Special") {
        if (child?.rule?.value !== realValue) return true
        if (symbol === "=" && child?.rule?.operator === "!=") return false
        if (symbol === "!=" && child?.rule?.operator === "=") return false
      }

      if (type !== child?.rule?.field) return true
      if (symbol === ">=" && child?.rule?.operator === ">") return false
      if (symbol === "<=" && child?.rule?.operator === "<") return false
      return true;
    })

    clone.group.children = children
    updateTree(clone.group)

    for (const child of children) {
      const rule = child.rule
      if (!rule) continue
      if (rule.field === "Special") continue

      if (rule.field === realKey && rule.operator === symbol) {
        if (rule.value === realValue) return clone
        rule.value = realValue
        setTextInput(convertTreeToText(clone))
        updateTree(clone.group)
        return clone
      }
    }

    if (realKey === "Special" && children.some(child => child.rule?.value.toLowerCase() === value.toLowerCase())) return clone

    const newRule: Node = { id: nanoid(), rule: { field: realKey, value: realValue, operator: symbol, type: getType(realKey) } }
    clone.group.children.push(newRule)
    updateTree(clone.group)
    setTextInput(convertTreeToText(clone))
    return clone
  }

  const removeRule = (item: TInputItem, operator: string) => {
    console.log(item, operator)
    const clone = cloneDeep(tree)
    if (!clone.group) return
    clone.group.children = clone.group.children.filter(child => {
      if (item.type === "switch") return item.key !== child?.rule?.value
      return item.key !== child?.rule?.field || !child?.rule?.operator.includes(operator)
    })
    updateTree(clone.group)
    setTextInput(convertTreeToText(clone))
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
        const symbol = (term.match(/(==|=|!=)/g) ?? ["="])[0] // gets operator
        const value = (term.match(/\w+$/g) ?? ["r"])[0] // gets word after operator
        const aliasedType = textAliasMap.get(type) ?? type
        const aliasedValue = textAliasMap.get(value) ?? value
        contents.push({ type: aliasedType, symbol, value: aliasedValue })
        state = updateValuePair(aliasedType, symbol, aliasedValue, state)
      }
    }

    if (!state || !state.group) return
    const children = state.group.children.filter(child => {
      for (const content of contents) {
        const rule = child.rule
        if (!rule) return true
        if (
          rule.field.toLowerCase() === content.type.toLowerCase() &&
          rule.operator === content.symbol &&
          rule.value.toLowerCase() === content.value.toLowerCase()
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
    <div className="content-box flex flex-col gap-4">
      <div className="flex items-center">
        <label className="min-w-[8rem] label">Text Input</label>
        <Input
          placeholder="Use osu! search terms e.g. cs>5 ar=8"
          value={textInput}
          onChange={(t) => handleTextChange(t)}
        />
      </div>

      {aboveSection.items.map(item => (
        <InputItem {...item} onChange={(value) => handleChange(value, item)} value={getValue(tree, item)} />
      ))}

      <div className="flex items-center gap-2 w-full justify-between mt-2">
        {sections.map(item => (
          <div
            key={item.title}
            className={classNames(
              { 'bg-emerald-600 pointer-events-none': section.title === item.title },
              { 'bg-sky-500 hover:bg-sky-600': section.title !== item.title },
              "w-full p-1 text-center text-white py-2 rounded font-medium cursor-pointer")}
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
