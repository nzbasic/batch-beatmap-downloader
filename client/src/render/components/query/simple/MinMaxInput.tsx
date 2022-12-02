import React from "react"
import { TInputItemProps } from "./InputItem";
import { TInputItemMinMax } from "../../../../models/simple";
import { NumericInput } from "../../util/NumericInput";

export const MinMaxInput: React.FC<TInputItemProps<TInputItemMinMax>> = ({ label, value, onChange, step }) => {
  const updateValue = (number: number, index: number) => {
    const newValues = [...value]
    newValues[index] = Number.isNaN(number) ? -1 : number
    onChange(newValues)
  }

  const convertValue = (number: number) => {
    if (number === -1) return NaN
    return number
  }

  return (
    <div className="flex items-center w-full">
      <span className="min-w-[8rem] label">{label}</span>
      <div className="flex items-center gap-2">
        <NumericInput
          placeholder="Min"
          step={step}
          className="p-1 px-2 w-16"
          value={convertValue(value[0])}
          onChange={(value) => updateValue(value, 0)}
        />

        <NumericInput
          placeholder="Min"
          step={step}
          className="p-1 px-2 w-16"
          value={convertValue(value[1])}
          onChange={(value) => updateValue(value, 1)}
        />
      </div>
    </div>
  )
}
