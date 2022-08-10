import React from "react"
import 'rc-slider/assets/index.css';
import { Input } from "../../util/Input";
import { TInputItemProps } from "./InputItem";
import { TInputItemMinMax } from "../../../../models/simple";
import is_number from "is-number";

export const MinMaxInput: React.FC<TInputItemProps<TInputItemMinMax>> = ({ label, value, onChange }) => {
  const updateValue = (newValue: string, index: number) => {
    // todo handle x.
    if (is_number(newValue)) {
      const number = parseFloat(newValue)
      const newValues = [number, value[1-index]]
      if (index === 1) newValues.reverse()
      onChange(newValues)
    } else if (newValue === "") {
      const newValues = [...value]
      newValues[index] = -1
      onChange(newValues)
    }
  };

  return (
    <div className="flex items-center w-full">
      <span className="w-32 label">{label}</span>
      <div className="flex items-center gap-4">
        <label className="label">Min</label>
        <div className="w-16">
          <Input
            className="p-1"
            value={(value[0] === -1 ? "" : value[0]).toString()}
            onChange={(value) => updateValue(value, 0)}
          />
        </div>
        <label className="label">Max</label>
        <div className="w-16">
          <Input
            className="p-1"
            value={(value[1] === -1 ? "" : value[1]).toString()}
            onChange={(value) => updateValue(value, 1)}
          />
        </div>
      </div>
    </div>
  )
}
