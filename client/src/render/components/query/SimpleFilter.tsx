import React, { useEffect, useState } from "react"
import { Group, Node } from "../../../models/filter"
import { inputOptions, Rule, RuleType } from "../../../models/rules"
import { useTextInput } from "../../hooks/useTextInput"
import { InputType, TInputItem } from "../../types/input"
import InputItem from "./simple/InputItem"
import { MinMaxInput } from "./simple/MinMaxInput"
import { v4 as uuidv4 } from 'uuid'

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
  }
]

const treeIsCompatibleWithSimpleMode = (group: Group) => {
  return true
}

const convertTreeToSimpleMode = (group: Group) => group

export const SimpleFilter: React.FC<PropTypes> = ({ tree, updateTree, limit, setLimit, loading, exportData }) => {
  const [textInput, textValue] = useTextInput({ placeholder: "Use osu! search terms e.g. cs>5 ar=8", label: "Text Input" })

  useEffect(() => {
    if (tree.group && !treeIsCompatibleWithSimpleMode(tree.group)) {
      updateTree(convertTreeToSimpleMode(tree.group))
    }
  }, [tree])

  console.log(tree)

  const handleChange = (value: string | number[], key: string) => {
    //
  }

  const addRule = (field: string, operator: string, value: string, type: RuleType) => {
    const newRule: Node = {
      id: uuidv4(),
      rule: {
        field,
        operator,
        value,
        type
      }
    };

    const group = tree.group
    if (!group) return

    updateTree({ ...group, children: [...group.children, newRule] })
  }

  useEffect(() => {
    const terms = textValue.toLowerCase().split(" ")
    for (const term of terms) {
      if (term.match(/^\w*(<|<=|>|>=|==|=|!=)\d+\.?\d*$/g)) {
        let type = (term.match(/^\w+/g) ?? ["stars"])[0] // gets the word before operator
        const symbol = (term.match(/(<=|<|>=|>|==|=|!=)/g) ?? ">=")[0] // gets operator
        const number = (term.match(/\d+\.?\d*$/g) ?? ["0"])[0] // gets number after operator

        if (type === "length") { type = "drain" }
        if (type === "stars") { type = "sr" }
        if (type === "keys") { type = "cs" }

        const [min, max] = findValueNumber(type)
        console.log(min, max)

        // let newValue = min
        // if (symbol === ">") newValue = [number + 0.1, max]
        // if (symbol === ">=") newValue = [number, max]
        // if (symbol === "<") newValue = [min, number - 0.1]
        // if (symbol === "<=") newValue = [min, number]
        // if (symbol === "=" || symbol === "==") newValue = [number, number]
        addRule(type, symbol, number, RuleType.NUMBER)
      }
    }
  }, [textValue])

  const findValue = (key: string): string | number[] => {
    const type = inputOptions.find(i => i.value.toLowerCase() === key.toLowerCase())?.type ?? RuleType.TEXT

    if (!tree.group) return [0, 10]
    for (const child of tree.group.children) {
      if (!child.rule) return [0, 10]

      if (child.rule.field.toLowerCase() === key.toLowerCase()) {

      }
    }

    return [0, 10]
  }

  const findValueNumber = (key: string): number[] => {
    const output: number[] = []
    const defaultValue = [0, 10]
    const [dMin, dMax] = defaultValue

    const mins: number[] = [dMin]
    const maxs: number[] = [dMax]

    if (!tree.group) return defaultValue
    for (const child of tree.group.children) {
      if (!child.rule) return defaultValue
      if (child.rule.field.toLowerCase() === key.toLowerCase()) {
        const op = child.rule.operator
        const val = parseFloat(child.rule.value)
        if (op === "<" || op === "<=") maxs.push(val)
        if (op === ">" || op === ">=") mins.push(val)
        if (op === "=" || op === "==") return [val, val]
      }
    }

    maxs.sort()
    mins.sort()
    output.push(maxs[0])
    output.push(mins[mins.length - 1])

    return output
  };

  return (
    <div className="container flex flex-col gap-2">
      {textInput}
      {config.map(item => (
        <InputItem {...item} onChange={(e) => handleChange(e, item.key)} value={findValueNumber(item.key)} />
      ))}
    </div>
  )
}
